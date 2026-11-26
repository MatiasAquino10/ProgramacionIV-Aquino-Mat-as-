import { useState } from "react";
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material"
import API_URL from "../config/api"
const API_MATERIA = `${API_URL}/materias`


export function FormularioM({onMateriaCreado, materiaEditar, onCancelar}){
    const [formulario, setFormulario] = useState({
        codigo: String(materiaEditar?.codigo ?? ""),
        nombre: materiaEditar?.nombre ?? "",
        descripcion: materiaEditar?.descripcion ?? "",
        cargaHoraria: materiaEditar?.cargaHoraria ?? "",
        estado: materiaEditar?.estado??"",
    })

    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(false)

    function manejarCambio(e) {
        const { name, value} = e.target

        setFormulario({
            ...formulario,
            [name]: value
        })
    }

    async function guardar(e) {
        e.preventDefault()
        setError("")
        setGuardando(true)
    const editando = Boolean(materiaEditar)
    const url = editando?`${API_MATERIA}/${materiaEditar.codigo}` : API_MATERIA

        try{
            const alumno ={
                ...formulario,
                codigo: String(formulario.codigo),
                cargaHoraria: Number(formulario.cargaHoraria)
            }
            const respuesta = await fetch(url, {
                method: editando ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alumno)
            })
            if(!respuesta.ok){
                throw new Error(`No se puedo guardar el materia. Estado HTTP: ${respuesta.status}`)
            } 
            setFormulario({
                codigo:"",
                nombre: "",
                descripcion: "",
                cargaHoraria: "",
                estado: "",
            })
            onMateriaCreado()
        } catch(error){
            console.error("Error al guardar el materia:", error)
            setError(error.message || "No se puedo conectar con el servidor")
        } finally{
            setGuardando(false)
        }
    }

    return(
        <Paper
            component="section"
            elevation={0}
            sx={{
                p: { xs: 2.5, sm: 3.5 },
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 4,
                bgcolor: "background.paper"
            }}
        >
            <Typography component="h2" variant="h5" sx={{ mb: 2.5, fontWeight: 700 }}>
                {materiaEditar ? "Editar materia" : "Nueva Materia"}
            </Typography>
            <Box
                component="form"
                onSubmit={guardar}
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    gap: 2
                }}
            >
                <TextField
                    id="codigo"
                    name="codigo"
                    label="Código"
                    value={formulario.codigo}
                    onChange={manejarCambio}
                    required
                    fullWidth
                />
                <TextField
                    id="nombre"
                    name="nombre"
                    label="Nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                    fullWidth
                />
                <TextField
                    id="descripcion"
                    name="descripcion"
                    label="Descripción"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    required
                    fullWidth
                />
                <TextField
                    id="cargaHoraria"
                    name="cargaHoraria"
                    label="Carga horaria"
                    value={formulario.cargaHoraria}
                    onChange={manejarCambio}
                    required
                    fullWidth
                />
                <TextField
                    select
                    id="estado"
                    name="estado"
                    label="Estado"
                    value={formulario.estado}
                    onChange={manejarCambio}
                    required
                    fullWidth
                >
                    <MenuItem value="activa">Activa</MenuItem>
                    <MenuItem value="inactiva">Inactiva</MenuItem>
                </TextField>
                <Box
                    sx={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mt: 1
                    }}
                >
                    <Button type="submit" variant="contained" disabled={guardando}>
                        {guardando
                            ? "Guardando..."
                            : materiaEditar
                                ? "Guardar cambios"
                                : "Guardar"}
                    </Button>
                    {materiaEditar && (
                        <Button
                            type="button"
                            onClick={onCancelar}
                            disabled={guardando}
                            variant="outlined"
                        >
                            Cancelar
                        </Button>
                    )}
                </Box>
                {error && (
                    <Alert severity="error" role="alert" sx={{ gridColumn: "1 / -1" }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Paper>
    )
}
