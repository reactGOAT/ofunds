"use client";

import { useState } from "react";
import { CreditCard, Calendar, Building2 } from "lucide-react";
import { RequestCardDialog } from "@/components/dialogs/request-card-dialog";
import { useGetAtmCardCharge } from "@/hooks/useCards";

export default function CardsClient() {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const { data: cardCharge } = useGetAtmCardCharge();

  const formatAmount = (amount: string | number | undefined) => {
    if (!amount) return "0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num.toLocaleString("en-NG");
  };

  return (
    <>
      {/* Add CSS styles for enhanced 3D card animation */}
      <style jsx>{`
        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px) rotateZ(0deg);
          }
          50% {
            transform: translateY(-8px) rotateZ(1deg);
          }
        }

        @keyframes cardSpin3D {
          0% {
            transform: perspective(1500px) rotateY(0deg) rotateX(0deg) translateZ(0px);
            filter: brightness(1) drop-shadow(0 20px 40px rgba(0,0,0,0.3));
          }
          25% {
            transform: perspective(1500px) rotateY(45deg) rotateX(8deg) translateZ(20px);
            filter: brightness(1.1) drop-shadow(0 25px 50px rgba(0,0,0,0.4));
          }
          50% {
            transform: perspective(1500px) rotateY(90deg) rotateX(5deg) translateZ(30px);
            filter: brightness(1.2) drop-shadow(0 30px 60px rgba(0,0,0,0.5));
          }
          75% {
            transform: perspective(1500px) rotateY(135deg) rotateX(-8deg) translateZ(20px);
            filter: brightness(1.1) drop-shadow(0 25px 50px rgba(0,0,0,0.4));
          }
          100% {
            transform: perspective(1500px) rotateY(180deg) rotateX(0deg) translateZ(0px);
            filter: brightness(1) drop-shadow(0 20px 40px rgba(0,0,0,0.3));
          }
        }

        @keyframes cardSpin3DReverse {
          0% {
            transform: perspective(1500px) rotateY(180deg) rotateX(0deg) translateZ(0px);
            filter: brightness(1) drop-shadow(0 20px 40px rgba(0,0,0,0.3));
          }
          25% {
            transform: perspective(1500px) rotateY(225deg) rotateX(-8deg) translateZ(20px);
            filter: brightness(1.1) drop-shadow(0 25px 50px rgba(0,0,0,0.4));
          }
          50% {
            transform: perspective(1500px) rotateY(270deg) rotateX(-5deg) translateZ(30px);
            filter: brightness(1.2) drop-shadow(0 30px 60px rgba(0,0,0,0.5));
          }
          75% {
            transform: perspective(1500px) rotateY(315deg) rotateX(8deg) translateZ(20px);
            filter: brightness(1.1) drop-shadow(0 25px 50px rgba(0,0,0,0.4));
          }
          100% {
            transform: perspective(1500px) rotateY(360deg) rotateX(0deg) translateZ(0px);
            filter: brightness(1) drop-shadow(0 20px 40px rgba(0,0,0,0.3));
          }
        }

        .card-3d-container {
          transform-style: preserve-3d;
          animation: 
            cardFloat 4s infinite ease-in-out,
            cardSpin3D 8s infinite cubic-bezier(0.4, 0.0, 0.2, 1),
            cardSpin3DReverse 8s infinite cubic-bezier(0.4, 0.0, 0.2, 1) 8s;
          will-change: transform, filter;
        }

        .card-3d-container:hover {
          animation-play-state: paused;
          transform: perspective(1500px) rotateY(25deg) rotateX(15deg) translateZ(50px) scale(1.08);
          filter: brightness(1.3) drop-shadow(0 40px 80px rgba(0,0,0,0.6));
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .card-3d-container::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-3d-container:hover::before {
          opacity: 0.6;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Enhanced depth for card elements */
        .card-3d-container > * {
          transform-style: preserve-3d;
          transform: translateZ(1px);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .card-3d-container {
            animation: 
              cardFloat 4s infinite ease-in-out,
              cardSpin3D 10s infinite cubic-bezier(0.4, 0.0, 0.2, 1),
              cardSpin3DReverse 10s infinite cubic-bezier(0.4, 0.0, 0.2, 1) 10s;
          }
        }
      `}</style>
      
      <div className="flex flex-col lg:flex-row gap-12 w-full justify-between items-start">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-10 lg:max-w-[500px]">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-bold text-3xl text-foreground">Ofunds Cards</h1>
          <button className="font-bold text-lg text-primary hover:text-primary/90 transition-colors">
            My Cards
          </button>
        </div>

        {/* Verve Card */}
        <div className="card-3d-container relative aspect-[1.6/1] w-full max-w-[500px] rounded-3xl overflow-hidden p-8 flex flex-col justify-between shadow-2xl bg-card border border-border transition-colors card-face">
          {/* Card Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent opacity-50 dark:opacity-30 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row */}
          <div className="relative flex items-start justify-between w-full z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                <span className="font-bold text-2xl text-background">O</span>
              </div>
              <span className="font-bold text-2xl text-foreground tracking-wide">
                Ofunds
              </span>
            </div>
            
            {/* EMV Chip */}
            <div className="w-12 h-10 rounded-xl overflow-hidden relative border border-black/10 dark:border-white/20 p-[5px] bg-gradient-to-br from-[#e0d6c8] to-[#b3a48e]">
              <div className="w-full h-px bg-black/20 mb-2" />
              <div className="w-full h-px bg-black/20 mb-2" />
              <div className="w-full h-px bg-black/20" />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/20 -translate-x-1/2" />
            </div>
          </div>

          {/* Bottom Row - Verve Logo */}
          <div className="relative flex items-end w-full z-10">
            <div className="flex items-center">
              <span className="font-bold text-xl text-destructive">V</span>
              <span className="font-bold text-xl text-foreground">erve</span>
            </div>
          </div>
        </div>


        {/* Text Section */}
        <div className="flex flex-col gap-4 max-w-[500px]">
          <h2 className="font-bold text-4xl text-foreground leading-tight">
            Get your Ofunds Card
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Shop online, pay in-store, and withdraw cash, seamlessly
            with your personalized Ofunds card.
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full max-w-[450px]">
        <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-2 relative shadow-sm">
          {/* Issuing Fee */}
          <div className="flex gap-4 items-center p-4 rounded-2xl w-full">
            <div className="w-12 h-12 rounded-xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex flex-col gap-1 justify-center">
              <h3 className="font-bold text-lg text-foreground">Issuing Fee</h3>
              <p className="text-base text-muted-foreground">
                N{formatAmount(cardCharge)} shipping fee included
              </p>
            </div>
          </div>

          <div className="h-4 w-full px-4">
            <div className="w-full h-px bg-border" />
          </div>

          {/* Delivery Time */}
          <div className="flex gap-4 items-center p-4 rounded-2xl w-full">
            <div className="w-12 h-12 rounded-xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex flex-col gap-1 justify-center">
              <h3 className="font-bold text-lg text-foreground">Delivery Time</h3>
              <p className="text-base text-muted-foreground">
                Arrives in 3–5 business days
              </p>
            </div>
          </div>

          <div className="h-4 w-full px-4">
            <div className="w-full h-px bg-border" />
          </div>

          {/* Card Usage */}
          <div className="flex gap-4 items-center p-4 rounded-2xl w-full">
            <div className="w-12 h-12 rounded-xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex flex-col gap-1 justify-center">
              <h3 className="font-bold text-lg text-foreground">Card Usage</h3>
              <p className="text-base text-muted-foreground">
                Use anywhere Verve is accepted
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8 w-full">
            <button 
              onClick={() => setRequestDialogOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-5 rounded-[20px] shadow-[0_10px_15px_-3px_rgba(255,106,0,0.3)] transition-all active:scale-[0.98]"
            >
              Get Card
            </button>
          </div>
        </div>
      </div>

      {/* Request Card Dialog */}
      <RequestCardDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
      />
    </div>
      </>
  );
}
