'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react'
import { signup } from './actions/register_action'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useForm } from 'react-hook-form'
import { error } from 'console'

export default function RegisterPage() {
    const router = useRouter()

    // Estados para manejar la visualización del Alert y errores
    const [showAlert, setShowAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<{ email: string, password: string, confirmPassword: string }>()

    async function handleRegister(data: { email: string, password: string, confirmPassword: string }) {
        setErrorMsg("")
        const { email, password, confirmPassword } = data
        if (password !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden")
            return
        }
        setIsLoading(true)
        try {
            const response = await signup({ email, password })
            if (response?.error) {
                setErrorMsg(response.error)
                console.error('Error de registro:', response.error)
            } else if (response?.success) {
                console.log(response.success)
                setShowAlert(true)
                reset()
            }
        } catch (error) {
            setErrorMsg("Ocurrió un error inesperado.")
        } finally {
            setIsLoading(false)
            console.log('Proceso de registro finalizado')
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 overflow-hidden relative">
            <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />

            <Card className="w-full max-w-lg shadow-2xl border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl relative z-10">
                <CardHeader className="space-y-3 text-center pb-6 pt-8">
                    <div className="mx-auto bg-purple-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-indigo-600/20">
                        <UserPlus className="text-white w-7 h-7" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Crear una cuenta
                    </CardTitle>
                    <CardDescription className="text-base">
                        Únete a nosotros completando tus datos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Agregamos el onSubmit al formulario */}
                    <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                {errorMsg}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium ml-1">Correo Electrónico</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    id="email"
                                    {...register("email", {
                                        required: "El correo es obligatorio",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "El correo no es válido"
                                        }
                                    })}
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    required
                                    className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-indigo-500 transition-all"
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1 ml-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium ml-1">Contraseña</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="password"
                                        {...register("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: {
                                                value: 6,
                                                message: "La contraseña debe tener al menos 6 caracteres"
                                            }
                                        })}
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-indigo-500 transition-all"
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-sm mt-1 ml-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium ml-1">Repetir Contraseña</Label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="confirmPassword"
                                        {...register("confirmPassword", {
                                            required: "Debes confirmar tu contraseña",
                                            validate: (value) =>
                                                value === watch("password") || "Las contraseñas no coinciden"
                                        })}
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 flex flex-col gap-3">
                            <Button
                                type='submit'
                                disabled={isLoading}
                                className='bg-purple-800 hover:bg-purple-700'
                            >
                                {isLoading ? 'Registrando...' : 'Registrarse'}
                                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Button>
                            <div className="text-center text-sm text-muted-foreground mt-2">
                                ¿Ya tienes una cuenta?{" "}
                                <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold hover:underline">
                                    Inicia sesión aquí
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Alert Dialog para la confirmación del correo */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Verifica tu correo electrónico</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            ¡Tu cuenta ha sido creada existosamente!
                            Te hemos enviado un correo de confirmación. Por favor, <strong>revisa tu bandeja de entrada o carpeta de spam</strong> y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => router.push('/login')}
                            className="bg-purple-700 hover:bg-purple-800 text-white"
                        >
                            Ir a Iniciar Sesión
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}