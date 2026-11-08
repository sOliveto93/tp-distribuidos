const URL_BASE = import.meta.env.VITE_URL_BASE;
const PORT_EXPRESS = import.meta.env.VITE_PORT_EXPRESS;

export const fetchRecomendaciones = async()=>{
    const res=await fetch(`${URL_BASE}${PORT_EXPRESS}/obras/recomendaciones`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
    });

        if (!res.ok) {
          throw new Error("Error al obtener las recomendaciones");
        }
        
        return  await res.json();

    }