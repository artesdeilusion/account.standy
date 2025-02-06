import { Instagram, LinkedIn, X } from "@mui/icons-material";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */


function Footer() {
    return (

        <footer className="bg-black     text-white  ">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 xl:px-0  lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="    mb-6 md:mb-0">
                        <div className="flex items-center  flex-row space-x-1">
                            <Link href="/">
                                <img
                                    src="/standy.svg"
                                    alt="Standy Logo"
                                    width={120}
                                    height={120}
                                />
                            </Link>
                            
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-md font-semibold text-standy-light tracking-wide   ">Basın</h2>
                            <ul  >
                                <li className="mb-4">
                                    <a target="_blank" href="https://firebasestorage.googleapis.com/v0/b/standy-c3f1e.appspot.com/o/Design%20Outlines%2FStandy%20Design%20Outlines.pdf?alt=media&token=b1e2eecc-1c0d-4794-9d52-f2bf4857935c" className="hover:underline">Basın Kiti</a>
                                </li>

                            </ul>
                        </div>


                        <div>
                            <h2 className="mb-6 text-md font-semibold text-standy-light tracking-wide   ">Şirket</h2>
                            <ul  >
                                <li className="mb-4">
                                    <a target="_blank" href="https://help.standyroutes.com/" className="hover:underline">Bize Ulaşın</a>
                                </li>
                                <li className="mb-4">
                                    <Link target="_blank" href="https://www.standyroutes.com/faq" className="hover:underline">SSS</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="mb-6 text-md font-semibold text-standy-light tracking-wide   ">Yasal</h2>
                            <ul  >
                                <li className="mb-4">
                                    <Link target="_blank" href="https://www.standyroutes.com/privacy-policy" className="hover:underline">Gizlilik Politikası</Link>
                                </li>
                                <li>
                                    <Link target="_blank" href="https://www.standyroutes.com/terms-of-service" className="hover:underline">Şartlar ve Koşullar
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6   sm:mx-auto  border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm  sm:text-center ">© 2025 <a target="_blank" href="https://artesdeilusion.com/" className="hover:underline">Artes de Ilusion™</a>. Tüm Hakları Saklıdır.
                    </span>
                    <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
                        <a target="_blank" href="https://www.instagram.com/standyturkiye" className=" hover:text-rose-red">
                            <Instagram></Instagram>

                            <span className="sr-only">Instagram</span>
                        </a>
                        <a target="_blank" href="https://x.com/standyroutes" className="  hover:text-rose-red">
                            <X></X>
                            <span className="sr-only">Twitter</span>

                        </a>
                        <a target="_blank" href="https://linkedin.com/company/standy" className=" hover:text-rose-red">
                            <LinkedIn></LinkedIn>
                            <span className="sr-only">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer;