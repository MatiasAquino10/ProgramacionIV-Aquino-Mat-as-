import { ListaMaterias } from "../components/ListaMateria";
import { useState } from "react";
import { FormularioM } from "../components/FormularioM";

export default function Materias() {
  const [actualizar, setActualizar] = useState(0)
  const [materiaEditar, setMateriaEditar] = useState(null)
  
  function materiaCreado(){
    setActualizar(valor => valor+1)
    setMateriaEditar(null)
  }
  
  function seleccionarMateria(materia){
      setMateriaEditar(materia)
  }

return(
<>
    <FormularioM key={materiaEditar?.codigo ?? "nuevo"}
    onMateriaCreado={materiaCreado}
    materiaEditar={materiaEditar}
    onCancelar={() => setMateriaEditar(null)}/> 
    <ListaMaterias actualizar={actualizar}
    onMateriaCreado={materiaCreado}
    onEditarMateria={seleccionarMateria}/> 
</>
)}