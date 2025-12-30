'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react'
import { signup } from './actions/register_action'
import Link from 'next/link'
import { useForm } from 'react-hook-form'


export default function RegisterPage() {

    // asignarle un modelo de datos al formulario
    const {register, handleSubmit , setValue, formState: {errors} , reset} = useForm();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 overflow-hidden relative">

            {/* Elementos decorativos de fondo */}
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
                    <form className="space-y-5">
                        {/* Fila de Nombre y Apellido */}
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-sm font-medium ml-1">Nombre</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        placeholder="Juan"
                                        required
                                        className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-sm font-medium ml-1">Apellido</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        placeholder="Pérez"
                                        required
                                        className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div> */}
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium ml-1">Correo Electrónico</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    required
                                    className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Contraseñas */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium ml-1">Contraseña</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium ml-1">Repetir Contraseña</Label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
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
                                formAction={signup}
                                className='bg-purple-800 hover:bg-purple-700'                            >
                                Registrarse
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
        </div>
    )
}