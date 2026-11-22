"use client";

import { useEffect, useState, useRef } from "react";
import { Bus, Award, MapPinned, HeartHandshake } from "lucide-react";
import { BusinessStats } from "@/types";

interface StatsSectionProps {
  stats: BusinessStats;
}

function Counter({
  endValue,
  suffix = "",
}: {
  endValue: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800; // ms
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = endValue / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= endValue) {
              setCount(endValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [endValue, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
      {count.toLocaleString("en-IN")}
      <span className="text-amber-400">{suffix}</span>
    </div>
  );
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      label: "Modern Buses in Fleet",
      value: stats.busesCount,
      suffix: "+",
      description: "Mini, Executive & Luxury Coaches",
      icon: Bus,
    },
    {
      label: "Years of Trust & Service",
      value: stats.experienceYears,
      suffix: "+",
      description: "Unmatched travel excellence",
      icon: Award,
    },
    {
      label: "Trips Safely Completed",
      value: stats.tripsCompleted,
      suffix: "+",
      description: "Local, outstation & pilgrimages",
      icon: MapPinned,
    },
    {
      label: "Delighted Happy Travelers",
      value: stats.happyCustomers,
      suffix: "+",
      description: "Families, corporates & schools",
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 p-3 rounded-2xl transition-all hover:bg-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-1">
                  <Icon className="w-6 h-6" />
                </div>
                <Counter endValue={item.value} suffix={item.suffix} />
                <div className="text-sm font-bold text-slate-200">
                  {item.label}
                </div>
                <div className="text-xs text-slate-400">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
