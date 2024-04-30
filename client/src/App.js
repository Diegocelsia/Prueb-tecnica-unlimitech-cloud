import React, { Fragment, useState, useEffect } from "react"
import Modal from "react-modal"

function App() {
  //Definir estados
  const [file, setFile] = useState(null) //Verificar estado de la foto cargada
  const [imageList, setImageList] = useState([]) //almacenar lista de image
  const [listUpdate, setListUpdate] = useState(false)//gestor para actualizar lista de imagenes
  const [modalIsOpen, setModalIsOpen] = useState(false) //abrir y cerrar modal
  const [currentImage, setcurrentImage] = useState(null) //Imagen completa modal


  Modal.setAppElement("body");//se utilza modal en el body

  
  useEffect(() => {
    //Obtener lista de imagenes
    fetch("http://localhost:9000/images/get")//fetch realiza peticion https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
      .then((res) => res.json())//convierte la respuesta http en tx
      .then((res) => setImageList(res))//actualiza la lista de imahenes
      .catch((err) => {
        console.error(err)
      })
      setListUpdate(false);//actualizar el estado de las imagenes
    }, [listUpdate])


    const selectedHandler = (e) => {
    setFile(e.target.files[0])
    };


    //Profundizar, bastante engorroso.
    const sendHandler = () => {
      if (!file) {
        alert("Cargar una imagen")
        return;
      }
      //Gestion de imagen seleeccionada https://www.youtube.com/watch?v=pSd9w9tx5MQ. Min 24
      const formdata = new FormData();//https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects, metodo para cargar formularios 
      formdata.append("image", file); //image es como quedaria renombrada la imagen, ojo.

      fetch("http://localhost:9000/image/post", {//se envia la imagen POST ES PARA ENVIAR. 
        method: "POST",
        body: formdata,
      })
        .then((res) => res.text())
        .then((res) => {
          console.log(res);
          setListUpdate(true)
        })
        .catch((err) => {
          console.error(err)//Solo verifcar si esta mal la funcion sendHandler
        });

      document.getElementById("fileinput").value = null;//resetea el formulario
      setFile(null); //se deja el archivo en cero
    }



    const modalHandler = (isOpen, image) => {
      setModalIsOpen(isOpen)
      setcurrentImage(image)
    }

    const deleteHandler = () => {
      let imageID = currentImage.split("-")
      console.log(imageID[0])
      imageID = parseInt(imageID[0])

      fetch("http://localhost:9000/images/delete/" + imageID, {
        method: "DELETE",
      })
        .then((res) => res.text())
        .then((res) => console.log(res))

      setListUpdate(true)
    }

    return (
      <Fragment>
        <nav className="navbar navbar-dark" style={{ background: "#29B6F6" }}>
          <div className="container">
            <a href="#!" className="navbar-brand">Gestor de Imagenes</a>
          </div>
        </nav>

        <div className="container mt-5">
          <div className="card p-3" style={{ border: "none", background: "#29B6F6" }}>
            <div className="row">
              <div className="col-10">
                <input id="fileinput" onChange={selectedHandler} className="form-control" type="file"/>
              </div>

              <div className="col-2">
                <button onClick={sendHandler} type="button"className="btn btn-primary col-12">Cargar</button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="container mt-3"
          style={{ display: "flex", flexWrap: "wrap" }}>
          {imageList.map((image) => (
            <div key={image} className="card m-2">
              <img src={"http://localhost:9000/" + image} alt="..." className="card-img-top" style={{ height: "200px", width: "300px" }}/>

              <div className="card-body">
                <button type="button" class="btn btn-info" onClick={() => modalHandler(true, image)}>Ver</button>
              </div>
            </div>
          ))}
        </div>

        <Modal style={{ content: { right: "20%", left: "20%" } }} isOpen={modalIsOpen}>
          <div className="card" style={{ border: "none" }}>
            <img src={"http://localhost:9000/" + currentImage} alt="..." style={{ borderRadius: "10px" }}/>

            <div className="card-body" style={{ maxWidth: "100%", maxHeight: "100%" }}>
              <button onClick={() =>  deleteHandler() + setModalIsOpen(false)} type="button" className="btn btn-danger" style={{ marginRight: "5px", width: "120px" }}>Borrar</button>
              <button onClick={() => setModalIsOpen(false)} type="button" className="btn btn-primary">Volver</button>
            </div>
            
          </div>
        </Modal>
      </Fragment>
    );
  }

  export default App;
