import { useEffect, useState } from "react"
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material"
import API_URL from "../config/api"
const API_MATERIAS = `${API_URL}/materias`
import { useAuth } from "../context/useAuth"

export function ListaMaterias({actualizar, onMateriaCreado, onEditarMateria}){
    const [materia, setMateria] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")
    const { token, usuario } = useAuth()

    async function eliminarMateria(codigo) {
        const confirmar = window.confirm("¿Estas seguro de querer eliminar el recurso?")
        if (!confirmar) {
            return
        } 
        try{
            const respuesta = await fetch(`${API_MATERIAS}/${codigo}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!respuesta.ok) {
                throw new Error(`Error al eliminar el materia. Estado http: ${respuesta.status}`)
            }
            onMateriaCreado()
        } catch(error){
            console.error("Error al eliminar el materia:", error)
            alert(error.message || "No se puedo eliminar el materia")
            setError("No se puedo actualizar la lista")
        }
        finally{
            setCargando(false)
        }
    }

    useEffect(() => {
        async function cargarMateria(){
            setCargando (true)
            setError("")
            try {
                const respuesta = await fetch(API_MATERIAS, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if(!respuesta.ok){
                  throw new Error ("No se pudo obtener la lista", respuesta.status)  
                }
                const datos = await respuesta.json()
                setMateria(datos)
            }catch (error){
                console.error("Error de conexion", error)
                setError ("No se puede cargar la lista de materiass")
            } finally {
                setCargando(false)
            }
        }

        cargarMateria()
    }, [actualizar, token])
    if (cargando){
        return (
            <Paper component="section" elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 4 }}>
                <Typography color="text.secondary">Cargando materias...</Typography>
            </Paper>
        )
    }
    if (error){
        return <Alert severity="error" role="alert">{error}</Alert>
    }
    return(
        <Paper
            component="section"
            elevation={0}
            sx={{
                p: { xs: 2.5, sm: 3.5 },
                border: 1,
                borderColor: "divider",
                borderRadius: 4,
                bgcolor: "background.paper"
            }}
        >
            <Typography component="h2" variant="h5" sx={{ mb: 2.5, fontWeight: 700 }}>
                Materias
            </Typography>
            {materia.length === 0
                ? (
                    <Typography color="text.secondary">
                        No hay materias registradas.
                    </Typography>
                )
                : (
                    <Stack
                        component="ul"
                        spacing={1.5}
                        sx={{ listStyle: "none", p: 0, m: 0 }}
                    >
                        {materia.map(materia => (
                            <Paper
                                component="li"
                                key={materia.codigo}
                                elevation={0}
                                sx={{
                                    p: { xs: 2, sm: 2.5 },
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: { xs: "stretch", sm: "center" },
                                    justifyContent: "space-between",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 2
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    sx={{ alignItems: "center", flexWrap: "wrap" }}
                                >
                                    <Chip label={`Código ${materia.codigo}`} color="primary" variant="outlined" size="small" />
                                    <Box>
                                        <Typography fontWeight={600}>{materia.nombre}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {materia.cargaHoraria} hs · {materia.estado}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                                    {usuario?.rol === "admin" && (
                                    <Button
                                        type="button"
                                        onClick={() => onEditarMateria(materia)}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Editar
                                    </Button>
                                    )}
                                    {usuario?.rol === "admin" && (
                                    <Button
                                        type="button"
                                        onClick={() => eliminarMateria(materia.codigo)}
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                    >
                                        Eliminar
                                    </Button>
                                    )}
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
        </Paper>
    )
}
