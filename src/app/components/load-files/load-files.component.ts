import { Component, Input, OnInit } from '@angular/core';

import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-load-files',
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.css'],
  providers: [FileService]
})
export class LoadFilesComponent implements OnInit {

  @Input() api: string;
  @Input() prop: string;
  files: File[] = [];

  constructor(
    private fileService: FileService
  ) { }

  ngOnInit(): void {
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  loadFiles(api: string, idParent: number) {
    this.readFile(this.files[0]).then(fileContents => {
      // Put this string in a request body to upload it to an API.
      console.log(fileContents);

    });

  }



}
