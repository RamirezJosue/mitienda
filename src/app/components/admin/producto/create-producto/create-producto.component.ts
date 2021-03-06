import { Component, OnInit, DoCheck } from '@angular/core';
import { Producto } from "../../../../models/Producto";
import { CategoriaService } from "../../../../services/categoria.service";
import { ProductoService } from "../../../../services/producto.service";
import { MarcaService } from 'src/app/services/marca.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
} 

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit, DoCheck {

  public file :File;
  public imgSelect : String | ArrayBuffer;
  public producto = new Producto('','','','','','','','','','','','','');
  public msm_error;
  public msm_success;
  public config;
  public data_categorias : any = [];
  public data_marcas;
  public data_subcategorias : any = [];
  public identity;

  constructor(
    private _categoriaService : CategoriaService,
    private _marcaService : MarcaService,
    private _productoService : ProductoService,
    private _userService: UserService,
    private _router : Router,
    private _route :ActivatedRoute,
  ) { 
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {

    if(this.identity){
      if(this.identity.role == '12$MAhAAdPTi92gVknt8QyKIuEzcRYM6pa8.3RwTjFMfMwJvs2Jube'){
        this._categoriaService.listar("").subscribe(
          response=>{
            response.categorias.forEach(element => {
              this.data_categorias.push({categoria : element.nombre,_id:element._id});
             
            });
          },
          error=>{
    
          }
        );
    
        this._marcaService.listar("").subscribe(
          response=>{
            this.data_marcas = response.marcas;
          },
          error =>{
    
          }
        );
    
        this.config = {
          height: 800,
          menubar: 'file edit view insert format tools table help',
          language : 'es',
          skin: 'material-classic',
          plugins: [
              'print preview fullpage paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons spellchecker mediaembed pageembed linkchecker powerpaste formatpainter casechange'
          ],
          toolbar:
          'casechange undo redo  bold italic underline strikethrough  fontselect fontsizeselect formatselect alignleft aligncenter alignright alignjustify outdent indent numlist bullist  forecolor backcolor removeformat pagebreak charmap emoticons fullscreen preview save print insertfile image media template link anchor codesample fullpage ltr rtl styleselect pageembed formatpainter',
          
        };
      }
      else{
        this._router.navigate(['/']);
      }
    }else{
      this._router.navigate(['/']);
    }
    
  }

  imgSelected(event: HtmlInputEvent){
    if(event.target.files  && event.target.files[0]){
        this.file = <File>event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imgSelect= reader.result;
        reader.readAsDataURL(this.file);
        $('.cz-file-drop-icon').addClass('cz-file-drop-preview img-thumbnail rounded');
        $('.cz-file-drop-icon').removeClass('cz-file-drop-icon czi-cloud-upload');
        
    }
    
  }

  ngDoCheck(): void {

    $('.cz-file-drop-preview').html("<img src="+this.imgSelect+">");
  }

  close_alert(){
    this.msm_error = '';
    this.msm_success = '';
  }

  onSubmit(productoForm){
 
    if(productoForm.valid){

        let data = {
          titulo : productoForm.value.titulo,
          poster : this.file,
          precio_ahora : productoForm.value.precio_ahora,
          precio_antes : productoForm.value.precio_antes,
          video_review : productoForm.value.video_review,
          info_short : productoForm.value.info_short,
          detalle : productoForm.value.detalle,
          stock : productoForm.value.stock,
          categoria : productoForm.value.categoria,
          subcategoria : this.producto.subcategoria,
          nombre_selector : productoForm.value.nombre_selector,
          marca : productoForm.value.marca,
        }
        
        this._productoService.registro(data).subscribe(
          response =>{
            this.producto = new Producto('','','','','','','','','','','','','');
            this._router.navigate(['/admin/productos']);
          },
          error=>{
            if(error.error.message == 'El titulo del producto ya existe, vuelve a intentar con otro.'){
              this.msm_error = error.error.message;
            }else{
              this.msm_error = 'Complete correctamente el formulario por favor.';
            }
            
            
          }
        ); 
    }else{
      this.msm_error = 'Complete correctamente el formulario por favor.';
    }
    
  }

  select_categoria(){
    this._categoriaService.list_one(this.producto.categoria).subscribe(
      response =>{
        $('#select-sub').removeAttr('disabled');
        this.data_subcategorias = response.categoria.subcategorias.split(',');
        
       
      },
      error=>{

      }
    );
    
  }
}
