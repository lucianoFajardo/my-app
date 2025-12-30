"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ErrorPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-xl border-border/50 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4 pb-6">
                    <div className="mx-auto bg-red-50 p-4 rounded-full w-fit animate-in zoom-in duration-300">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                            Algo salió mal
                        </CardTitle>
                        <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
                            Lo sentimos, ha ocurrido un error inesperado al procesar tu solicitud.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="text-center pb-6">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground font-mono">
                        Error 500
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 sm:gap-4 pb-10 px-10">
                    <Button
                        variant="outline"
                        className="w-full gap-2 hover:bg-muted/50 transition-colors"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                    <Button
                        className="w-full gap-2 shadow-sm hover:shadow transition-all"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reintentar
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}