import Link from "next/link"

export const Footer = () => {
    return (
        <div className=" text-gray-400 py-4">
            <div className="border-t border-gray-200 my-4"></div>
            <div className="container mx-auto px-4">
                <p className="text-center">
                    &copy; {new Date().getFullYear()} hecho por <Link
                        target="_blank"
                        href="https://linkedin.com/in/bauti-liendo" className="underline">Bautista Liendo</Link> Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}
