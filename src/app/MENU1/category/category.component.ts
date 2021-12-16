import { filter } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Categories } from 'src/app/models/categories.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Product } from 'src/app/models/product.model';
import { IMyGrid } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { FileUploadeService } from 'src/app/_shared/_services/file-uploade.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, IMyGrid, OnDestroy {
  edited: boolean = false;
  private subs = new SubSink();
  model: Categories = {};
  relatedProducts: Product[] = [];

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Category
      , defaultSortColumnName: "CategoryId",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "CategoryName", colText: ' Name' },
      { colName: "Description", colText: 'Description' }
      ]
    }
  };


  constructor(private gridService: GridService,

    public commonService: CommonService,
    private http: HttpClient, public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    public fileUploadeService: FileUploadeService
  ) {
    this.edited = false
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();

  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;
        this.relatedProducts = [];
        this.model = new Categories();
      } else if (params.id > 0) {
        this.edited = true;
        this.subs.sink = this.http
          .get<any>(`${environment.APIEndpoint}/Common/GetCategoryByID/` + params.id)
          .subscribe((data) => {

            this.model = data;
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });

        this.subs.sink = this.http
          .get<any>(`${environment.APIEndpoint}/Product/GetProductsByCategory/` + params.id)
          .subscribe((data) => {
            this.relatedProducts = data;
            console.log(data)
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });

      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: Categories) {
    if (obj == undefined) {
      this.router.navigate(['/category/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/category/edit'], { queryParams: { id: obj.CategoryId } });
    }
    this.edited = true
  }

  onSubmit(obj: Categories) {

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Category`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['category']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }


  DownloadExcel() {

    this.http.get(`${environment.APIEndpoint}/File/Excel/` + this.model.CategoryId
      , {
        responseType: 'blob'
      }).subscribe(x => {
        debugger
        const url = window.URL.createObjectURL(x);
        window.open(url);
      });
  }


  addFile(event): void {
    debugger
    let fileList: FileList = event.target.files;
    let self=this;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.fileUploadeService
        .upload(file).subscribe((res) => {
          const param = new HttpParams({ fromObject: { path: res.UploadFileName, categoryid: self.model.CategoryId.toString()} });
          this.subs.sink = this.http
            .get<any>(`${environment.APIEndpoint}/File/UploadFileExcel`, { params: param })
            .subscribe((data) => {
              if (data.IsValid == false) {
                this.confirmDialogService.messageListBox(data.ValidationMessages)
                event.target.value = null;
              }
              else {
                this.toastr.success(environment.dataSaved);
                event.target.value = null;
              }
            }, (error) => {
              this.confirmDialogService.messageBox(environment.APIerror)
              event.target.value = null;
            });
        }, (error) => { this.confirmDialogService.messageBox(environment.APIerror)
          event.target.value = null;
         });
    }
  }

  SaveAllRelatedProductsPrice() {
    debugger

    if (this.relatedProducts.filter(r => r.UnitPrice.toString() == '').length > 0) {
      this.confirmDialogService.messageBox("Invalid price found");
      return
    }

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Product/SaveAllRelatedProductsPrice`, this.relatedProducts, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }
}
