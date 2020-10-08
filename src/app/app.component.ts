import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChartType, ChartOptions, constructor } from 'chart.js';
import html2canvas from 'html2canvas';
import { Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { ClienteService } from './services/cliente.service';
import { saveAs } from 'file-saver';
import { FileSaver }  from 'angular-file-saver';
import { DataReportt } from 'src/model/grafica';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  base64textString:Array<String>;
  DataReport:DataReportt;
  private image: ImageData;

 // Trozos del pastel - Etiquetas
  public pieChartLabels: Label[] = ['IE00B0M62S72 - iShares Euro Dividend UCITS ETF EUR', 'IE00B14X4T88 - iShares Asia Pacific Dividend UCITS ETF USD', 'IE00B0M63177 - iShares MSCI Emerging Markets UCITS ETF', 'IE00B27YCK28 - iShares MSCI EM Latin America UCITS ETF USD'];

  // Trozos del pastel - Cantidades
  public pieChartData: number[] = [13, 23, 50, 8,2,1,1];

  // Trozos del pastel - Colores
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,0,255,1)', 'rgba(255,0,0,1)', 'rgba(255,255,0,1)', 'rgba(0,255,0,1)','rgba(255,0,0,1)','rgba(0,255,0,1)'],
    },
  ];

  // Opciones de la gráfica
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Niveles de riesgo',
      fontSize: 20,
      fontColor: 'rgba(0,0,0,1)',
      display: true
    },
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
        color: '#fff',
      },
    }
  };

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  constructor(private clienteS : ClienteService) { }

  ngOnInit() {
    this.DataReport= new DataReportt();
  }


  downloadImage(){
    html2canvas(this.screen.nativeElement).then(canvas => {
    //  this.canvas.nativeElement.src = canvas.toDataURL();
     // this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');      
     // this.downloadLink.nativeElement.download = 'marble-diagram.png';
     // this.downloadLink.nativeElement.click();
     // console.log(this.downloadLink.nativeElement);
     let base64 = canvas.toDataURL('image/png');
     this.base64textString = base64.split(',')
     let str = ''+this.base64textString[1];
     const sendRq = new DataReportt();
     sendRq.grafica = str;
     this.getFile(sendRq);
     console.log(base64);
    });
  }

  getFile(param:DataReportt){
    
    return this.clienteS.getFile(param).subscribe(res=>{
      //saveAs(res,'application/vnd.ms-excel')
      //saveAs(blo);
      console.log(res);
      let blo = new Blob([res], { type: 'application/vnd.ms-excel'});
      let url = window.URL.createObjectURL(blo);
      let pwa = window.open(url, "_blank");
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert( 'Please disable your Pop-up blocker and try again.');
       }
    },error=>{
      console.log("error");
      console.log(error);
    })
  }
}

