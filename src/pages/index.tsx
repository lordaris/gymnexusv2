import React from "react";
import Link from "next/link";
import LoginRedirect from "@/components/ui/loginRedirect";

export default function Home() {
  LoginRedirect();
  return (
    <div className="hero min-h-screen">
      <div
        className={
          "hero-content text-left p-10 text-primary-content place-content-center"
        }
      >
        <div className={"max-w-md"}>
          <p className={"font-bebas text-4xl leading-relaxed"}>
            Your fitness journey just got easier
          </p>
          <p className={"font-bebas text-3xl "}>Discover the power of</p>
          <div className={"text-6xl leading-relaxed"}>
            <span className={"font-thin font-lato"}>gym</span>
            <span className={"font-bebas text-primary"}>NEXUS</span>
          </div>
          <p className={"font-bebas text-3xl leading-relaxed"}>
            for personalized routines and seamless tracking
          </p>
          {/* center button */}
          <div className={"flex justify-center"}>
            <Link href={"/coach/signup"} className={"pb-4"}>
              <button className={"btn btn-primary btn-lg px-24 "}>
                I am new
              </button>
            </Link>
          </div>
          <Link href={"/login"} className={"flex justify-center link-primary"}>
            already a member?
          </Link>
          
          <Link className="flex justify-center font-bold py-10" href={"https://bmc.link/lordaris"}>Buy me a coffee!</Link>
        </div>
      </div>
    </div>
  );
}
