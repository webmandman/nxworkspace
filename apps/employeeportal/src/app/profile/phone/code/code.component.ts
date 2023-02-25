/* eslint-disable */
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CodeGeneratorService } from '../../../../app/shared/utils/code-generator.service';
import { CodeValidationService } from '../../../../app/shared/utils/code-validation.service';
import { isConstructorDeclaration } from 'typescript';

@Component({
  selector: 'app-phone-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  @Output() onVerify = new EventEmitter<boolean>();
  @Output() onChangeRequest = new EventEmitter<boolean>();
  codeForm: FormGroup;
  invalidMessage: string;
  codeMask: string;
  code: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private codeValidator: CodeValidationService,
    private codeGenerator: CodeGeneratorService) {
    this.invalidMessage = this.codeValidator.invalidMessage;
    this.codeMask = this.codeValidator.codeMask;
    this.code = this.codeGenerator.generate();
    this.codeForm = this.fb.group({
      code: ['', Validators.compose([
        this.codeValidator.patternValidator(this.code)
      ])]
    });
  }

  ngOnInit(): void {
    this.codeForm.controls['code'].statusChanges.subscribe(
      status => {
        if (
          status === 'VALID' &&
          this.codeForm.controls['code'].value == this.code
        ) {
          if (this.route.snapshot.queryParams['code']) {
            this.verify();
          } else {
            this.changerequest();
          }
        }
      }
    );
    // TODO: add 5 min timer => redirect to profile
  }

  submit(): void {
    if (this.codeForm.valid) {
      this.changerequest();
    }
  }

  get codeFormControl() {
    return this.codeForm.controls;
  }

  cancel(): void {
    this.location.back();
  }

  onCodeFail(): void {
    this.onVerify.emit(false);
  }
  verify(): void {
    this.onVerify.emit(true);
  }
  changerequest(): void {
    this.onChangeRequest.emit(true);
  }
}
