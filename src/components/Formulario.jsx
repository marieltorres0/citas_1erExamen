import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { pacienteSchema } from '../utils/pacienteSchema';

function Formulario({pacientes, setPacientes, paciente, setPaciente}) {
    const [nombre, setNombre] = useState('');
    const [propietario, setPropietario] = useState('');
    const [email, setEmail] = useState('');
    const [fecha, setFecha] = useState('');
    const [sintomas, setSintomas] = useState('');
    const [error, setError] = useState({});

    useEffect(() => {
        if (paciente?.id) {
            setNombre(paciente.nombre ?? '');
            setPropietario(paciente.propietario ?? '');
            setEmail(paciente.email ?? '');
            setFecha(paciente.fecha ?? '');
            setSintomas(paciente.sintomas ?? '');
            setError({});
            return;
        }

        setNombre('');
        setPropietario('');
        setEmail('');
        setFecha('');
        setSintomas('');
    }, [paciente]);

    const notify = (nombrePaciente) => toast(`Paciente ${nombrePaciente} agregado`);
    const notifyEdit = () => toast("Cambios guardados");


    const handleSubmit = (e) => {
        e.preventDefault();
        
    const resultado = pacienteSchema.safeParse({
       nombre,
       propietario,
       email,
       fecha,
       sintomas
    });

    if (!resultado.success) {
       setError(resultado.error.format());
       return;
    }
        
    setError({})

    const objetoPaciente = {
        nombre,
        propietario,
        email,
        fecha,
        sintomas
    }

    if(paciente && paciente.id) {
            //Editando paciente
            objetoPaciente.id = paciente.id
            const pacientesActualizados = pacientes.map( p => p.id === paciente.id ? objetoPaciente : p)
            setPacientes(pacientesActualizados)
            setPaciente({})
            notifyEdit() 
        } else {
            //Nuevo paciente
            objetoPaciente.id = Date.now().toString()
            setPacientes( [...pacientes, objetoPaciente] )
            notify(nombre)
        }
        setNombre('')
        setPropietario('')
        setEmail('')
        setFecha('')
        setSintomas('')
        setError({})
    }

    return (
        <section>
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-7">
            <h2 className="text-center font-[Manrope] text-3xl font-extrabold tracking-[-0.03em] text-slate-900">Seguimiento Pacientes</h2>
            <p className="mb-8 mt-4 text-center text-lg text-slate-600">
                Añade Pacientes y {''}
                <span className="font-bold text-teal-700">Administralos</span>
            </p>

            <form className="rounded-[1.75rem] border border-slate-200/80 bg-white px-5 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-6" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="mascota">
                        Nombre Mascota
                    </label>

                    <input
                        type="text"
                        id="mascota"
                        placeholder="Nombre de la mascota"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"   
                        value={nombre}
                        onChange={(e)=>setNombre(e.target.value)}      
                    />
                    
                    {error?.nombre?._errors[0] && (
                    <p className="mt-2 text-sm text-rose-600">
                       {error.nombre._errors[0]}
                     </p>
                    )}

                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="propietario">
                        Nombre Propietario
                    </label>

                    <input
                        type="text"
                        id="propietario"
                        placeholder="Nombre del propietario"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100" 
                        value={propietario}
                        onChange={(e)=>setPropietario(e.target.value)}        
                    />
                    {error?.propietario?._errors[0] && (
                    <p className="mt-2 text-sm text-rose-600">
                       {error.propietario._errors[0]}
                     </p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="email">
                        Email
                    </label>

                    <input
                        type="email"
                        id="email"
                        placeholder="correo@ejemplo.com"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"     
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}    
                    />
                    {error?.email?._errors[0] && (
                    <p className="mt-2 text-sm text-rose-600">
                       {error.email._errors[0]}
                     </p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="alta">
                        Alta
                    </label>

                    <input
                        type="date"
                        id="alta"
                        placeholder="Alta"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"   
                        value={fecha}
                        onChange={(e)=>setFecha(e.target.value)}      
                    />
                    {error?.fecha?._errors[0] && (
                    <p className="mt-2 text-sm text-rose-600">
                       {error.fecha._errors[0]}
                     </p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="sintomas">
                        Sintomas
                    </label>

                    <textarea
                        id="sintomas"
                        placeholder="Describe los Sintomas"
                        className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"   
                        value={sintomas}
                        onChange={(e)=>setSintomas(e.target.value)}      
                    />
                    {error?.sintomas?._errors[0] && (
                    <p className="mt-2 text-sm text-rose-600">
                       {error.sintomas._errors[0]}
                     </p>
                    )}
                </div>
       
                <input
                    type="submit"
                    className="w-full cursor-pointer rounded-2xl bg-slate-900 p-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-[0_24px_35px_-20px_rgba(13,148,136,0.65)] active:translate-y-0"
                    value="Agregar Paciente"
                />
            </form>
            </div>
        </section>
    )
}

export default Formulario