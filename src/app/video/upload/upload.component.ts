import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuidv4 } from 'uuid';
import { last } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  isDragover = false;
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded.';
  isSubmission = false;

  percentage = 0;
  showPercentage = true;

  file: File | null = null;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(private storage: AngularFireStorage) {}

  storeFile($event: DragEvent) {
    this.isDragover = false;
    this.file = $event.dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile() {
    this.showAlert = true;
    this.isSubmission = true;

    const clipName = uuidv4();
    const clipPath = `clip/${clipName}`;
    const task = this.storage.upload(clipPath, this.file);

    task.percentageChanges().subscribe((process) => {
      this.percentage = (process as number) / 100;
    });

    task
      .snapshotChanges()
      .pipe(last())
      .subscribe({
        next: () => {
          this.alertColor = 'green';
          this.alertMsg =
            'Success! Your clip is now ready to share with the world!';
          this.showPercentage = false;
        },
        error: (error) => {
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later';
          this.isSubmission = true;
          this.showPercentage = false;
          console.log(error);
        },
      });
  }
}
