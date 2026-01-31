const d = document
    $table = d.querySelector(".crud-table")
    $form = d.querySelector(".crud-form")
    $title = d.querySelector(".crud-title")
    $template = d.querySelector(".crud-template").content
    $fragment = d.createDocumentFragment()

    const ajax = (options) =>{
        let{url,method,success,error,data = null} = options //datos de nuestra function
        const xhr = new XMLHttpRequest()

        xhr.addEventListener("readystatechange", (e) => {
            if(xhr.readyState !== 4) return
            if(xhr.status >=200 && xhr.status < 300){
                let json = JSON.parse(xhr.responseText)
                success(json)
                }else{
                    let messages = xhr.statusText || "Ocurrio un error"
                    error(`Error ${xhr.status}: ${messages}`)
                }
        })

        xhr.open(method || "GET", url)
        xhr.setRequestHeader("content-type","application/json: charset=utf-8")
        xhr.send(JSON.stringify(data))
    }
    const GetAll = ()=>{
        ajax({
            method: "GET",
            url:"http://localhost:3000/users",
            success:(res)=>{
                
                res.forEach(element => {
                    $template.querySelector(".name").textContent =element.nombre
                    $template.querySelector(".constellation").textContent =element.constelacion
                    $template.querySelector(".edit").dataset.id=element.id
                    $template.querySelector(".edit").dataset.name=element.nombre
                    $template.querySelector(".edit").dataset.constellation=element.constelacion
                    $template.querySelector(".delete").dataset.id = element.id

                    let $clone = d.importNode($template,true)
                    $fragment.appendChild($clone)
                });
                $table.querySelector("tbody").appendChild($fragment)
            },
            error:(err)=>{
                console.error(err)
                $table.insertAdjacentHTML("afterend",`<p>${err}</p>`)
                $table.style.color="red"
            },
                
            data:null
        })
    }
    d.addEventListener("DOMContentLoaded",GetAll)

    const registerU = ()=>{
        e.preventDefault()
       
        //const post = {
        //    "name":
        //}
        ajax({
            method: "POST",
            url: "http://localhost:3000/users",
            success:(post) => {
                console.log(post)
            }

        })
    }
    d.addEventListener("submit", (e)=>{
        if(e.target === $form){
            e.preventDefault()
            if(!e.target.id.value){
                const data = {
                    nombre:e.target.nombre.value,
                    constelacion:e.target.nombre.value
                }
                //POST
                ajax({
                    url:"http://localhost:3000/users",
                    method:"POST",
                    success:(rest)=>{
                        location.reload()
                        $form.insertAdjacentHTML("afterend",`<p>Creado con exito</p>`)
                        $form.style.color="green"
                    },
                    error:(err)=>{
                        $form.insertAdjacentHTML("afterend",`<p>${err}</p>`)
                        $form.style.color="red"
                    },
                    data: data
                })
            }else{
                //put
                ajax({
                url:`http://localhost:3000/users/${e.target.id.value}`,
                method:"PUT",
                success:(res)=>{
                    location.reload()
                    $form.insertAdjacentHTML("afterend",`<p>Creado con exito</p>`)
                    $form.style.color="green"
                
                },
                error:(err)=>{
                    $form.insertAdjacentHTML("afterend",`<p>${err}</p>`)
                    $form.style.color="red"
                },
                data: {
                    nombre:e.target.nombre.value,
                    constelacion:e.target.constelacion.value
                }
            })
        }
    }
    })
    d.addEventListener("click",e=>{
        if(e.target.matches(".edit")){
            $title.textContent = "Editar Santo"
            $form.nombre.value = e.target.dataset.name
            $form.constelacion.value = e.target.dataset.constellation
            $form.id.value = e.target.dataset.id
            }
        if(e.target.matches(".delete")){
            let isDelete= confirm(`¿Estas seguro de eliminar el ID: ${e.target.dataset.id}`)
            if(isDelete){
                console.log(e)
                ajax({
                url:`http://localhost:3000/users/${e.target.dataset.id}`,
                method: "DELETE",
                success: ()=>{
                    location.reload()},
                error:(err)=>{
                    alert(err)
                }    
            })   
            }
        }})