"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, ArrowRight, Sparkles, Fingerprint, UserPlus } from 'lucide-react'
import { login } from './actions/login_action'
import Link from 'next/link'

export default function LoginPage() {

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 overflow-hidden relative">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <Card className="w-full max-w-md shadow-2xl border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl relative z-10">
                <CardHeader className="space-y-3 text-center pb-8 pt-10">
                    <div className="mx-auto bg-linear-to-tr from-blue-600 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-600/20 transform rotate-3 hover:rotate-0 transition-all duration-300">
                        <Sparkles className="text-white w-7 h-7" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Bienvenido de nuevo
                    </CardTitle>
                    <CardDescription className="text-base">
                        Ingresa tus credenciales para acceder al panel
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium ml-1">Correo Electrónico</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="nombre@ejemplo.com"
                                        required
                                        className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium ml-1">Contraseña</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 flex flex-col gap-3">
                            <Button
                                formAction={login}
                                className="w-full h-11 bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                            >
                                <Fingerprint className="w-4 h-4 mr-2" />
                                Iniciar Sesión
                                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Button>
                            <div className="relative py-2">
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="px-2 text-muted-foreground rounded-2xl">O si eres nuevo</span>
                                </div>
                            </div>
                            <div className="relative py-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-11 group"
                                >
                                    <Link href="/register" aria-label="Crear una cuenta">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Crear una cuenta
                                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}