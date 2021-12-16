import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadeService {

  constructor(private http:HttpClient) { }

  public addFile(x: FileList) {
debugger
    let fileList: FileList = x;
    var ret=""
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);

     return this.upload(file);
    }
  }


  upload(fileToUpload: any) {

    let input = new FormData();
    input.append("file", fileToUpload);
    return this.http
      .post<any>(`${environment.APIEndpoint}/File/Upload`, input);
  }
}
