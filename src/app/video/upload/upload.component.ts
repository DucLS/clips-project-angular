import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuidv4 } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded.';
  isSubmission = false;

  percentage = 0;
  showPercentage = true;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  file: File | null = null;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.isSubmission = true;

    const clipName = uuidv4();
    const clipPath = `clip/${clipName}.mp4`;
    const clipRef = this.storage.ref(clipPath);

    this.task = this.storage.upload(clipPath, this.file);

    this.task.percentageChanges().subscribe((process) => {
      this.percentage = (process as number) / 100;
    });

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipName}.mp4`,
            url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg =
            'Success! Your clip is now ready to share with the world!';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          });
        },
        error: () => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later';
          this.isSubmission = true;
          this.showPercentage = false;
        },
      });
  }
}
