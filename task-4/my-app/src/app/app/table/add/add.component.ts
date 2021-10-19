import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  val:any;
  // @Input()
  new:any;
  // @Output() change = new EventEmitter();

  constructor(public route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
      let sub=this.route.params.subscribe(params=>{
        this.val=params['id'];
    })
  }

  onClickSubmit(data:any){
    this.new=data;
    console.log(this.new);
    // this.change.emit(this.new);
    this.router.navigate([''])
  }

}
