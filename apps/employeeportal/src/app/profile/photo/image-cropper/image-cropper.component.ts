import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent {

    @Input() photo = '';
    @Output() cropped = new EventEmitter<string>();
    @Output() cancelled = new EventEmitter<boolean>();

    imageChangedEvent: any = '';
    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};


    done(): void{
      this.cropped.emit(this.photo);
    }

    cancel(): void{
      this.cancelled.emit(true);
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: any): void {
        this.photo = event.base64;
    }

    imageLoaded(): void {
        this.showCropper = true;
    }

    rotateLeft(): void {
        this.canvasRotation--;
        this.flipAfterRotate();
    }

    rotateRight(): void {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    flipHorizontal(): void {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH
        };
    }

    flipVertical(): void {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV
        };
    }

    resetImage(): void {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut(): void {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn(): void {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    toggleContainWithinAspectRatio(): void {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation(): void {
        this.transform = {
            ...this.transform,
            rotate: this.rotation
        };
    }

    private flipAfterRotate(): void {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }

}
