"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Ruler, Search, Table2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProductModal,
  type ProductModalView,
  type ProductSpec,
  type ProductVariant,
} from "./product-modal";

type ProductItem = {
  id: string;
  name: string;
  family: string;
  subFamily: string;
  catalogueRef: string;
  summary: string;
  applications: string;
  voltageClass?: string;
  standard?: string;
  image?: string | null;
  order: number;
  variants?: ProductVariant[];
};

/**
 * Product list mirrors the structure of the Taban Niroo 2026 Catalogue.
 * Each product has `image: null` — replace with the final image path
 * (e.g. "/products/long-rod-distribution.jpg") when the visuals are ready.
 *
 * To populate the Technical Data table for a catalogue reference, add a
 * `technical` object on the corresponding variant — every field is
 * optional and any missing field renders as a dash in the datasheet.
 *
 * @example
 *   // Matches the 13-column, 26-row datasheet grid used across the
 *   // entire catalogue (Catalogue Number + Shed No. + 11 data columns).
 *   // Only the fields you populate are shown; any missing field
 *   // renders as a dash in the grid.
 *   {
 *     code: "DPL132-5160-80/120BS",
 *     voltage: "132 kV",
 *     technical: {
 *       shedNo: "—",
 *       ratedVoltage: "132",
 *       sml: "80/120",
 *       couplingSize: "16",
 *       sectionLength: "1460±25",
 *       arcingDistance: "1340",
 *       shedDiameter: "160/125",
 *       shedSpacing: "60",
 *       minimumCreepage: "5160",
 *       impulseWithstand: "660",
 *       wetWithstand: "275",
 *       weight: "8.000",
 *     },
 *   }
 */
const PRODUCT_ITEMS: ProductItem[] = [
  // ────────────────────────────────────────────────────────────
  // 01 · Silicone Composite Insulators
  // ────────────────────────────────────────────────────────────
  {
    id: "long-rod-distribution",
    name: "Distribution Network Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Long Rod Insulator",
    catalogueRef: "DPL-20 · DPL-33 series",
    summary:
      "Composite long rod insulator for medium-voltage distribution networks. HTV silicone housing over an ECR fiberglass core with hot-dip galvanized forged-steel end fittings.",
    applications: "Medium-voltage distribution lines",
    voltageClass: "20 – 33 kV",
    standard: "IEC 61109 · IEC 61466 · IEC 60120 / 60471",
    image: null,
    order: 11,
  },
  {
    id: "long-rod-transmission",
    name: "Transmission Network Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Long Rod Insulator",
    catalogueRef: "DPL 63 · 132 · 230 · 400 series",
    summary:
      "High-strength composite long rod for transmission corridors up to 400 kV. Homogenized electrical field across end fittings and sealed triple-junction point against moisture infiltration.",
    applications: "Transmission lines · Suspension & tension",
    voltageClass: "63 – 400 kV",
    standard: "IEC 61109 · IEC 61192",
    image: null,
    order: 12,
  },
  {
    id: "suspension-tension-63-110",
    name: "63 & 110 kV Composite Suspension/Tension Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Suspension / Tension",
    catalogueRef: "DPL63 · DPL110 — 80/120 BS series",
    summary:
      "Composite suspension and tension insulators for 63 kV and 110 kV lines. Ball-and-socket fittings, 80/120 kN mechanical load class, IEC type-tested creepage and impulse performance.",
    applications: "Transmission lines · Suspension & tension",
    voltageClass: "63 · 110 kV",
    standard: "IEC 61109 · IEC 61192",
    image: null,
    order: 13,
    variants: [
      {
        code: "DPL63-1950-80/120BS",
        voltage: "63 kV",
        sectionLength: "855±15 mm",
        creepage: "1950 mm",
        technical: {
          ratedVoltage: "63",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "855±15",
          arcingDistance: "690",
          shedDiameter: "145/110",
          minimumCreepage: "1950",
          impulseWithstand: "410",
          wetWithstand: "185",
          weight: "5.00",
        },
      },
      {
        code: "DPL63-2200-80/120BS",
        voltage: "63 kV",
        sectionLength: "915±15 mm",
        creepage: "2200 mm",
        technical: {
          ratedVoltage: "63",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "915±15",
          arcingDistance: "750",
          shedDiameter: "145/110",
          minimumCreepage: "2200",
          impulseWithstand: "410",
          wetWithstand: "185",
          weight: "5.250",
        },
      },
      {
        code: "DPL63-2450-80/120BS",
        voltage: "63 kV",
        sectionLength: "915±15 mm",
        creepage: "2450 mm",
        technical: {
          ratedVoltage: "63",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "915±15",
          arcingDistance: "810",
          shedDiameter: "145/110",
          minimumCreepage: "2450",
          impulseWithstand: "410",
          wetWithstand: "185",
          weight: "5.500",
        },
      },
      {
        code: "DPL63-2700-80/120BS",
        voltage: "63 kV",
        sectionLength: "975±15 mm",
        creepage: "2700 mm",
        technical: {
          ratedVoltage: "63",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "975±15",
          arcingDistance: "870",
          shedDiameter: "145/110",
          minimumCreepage: "2700",
          impulseWithstand: "410",
          wetWithstand: "185",
          weight: "5.700",
        },
      },
      {
        code: "DPL63-2950-80/120BS",
        voltage: "63 kV",
        sectionLength: "1095±15 mm",
        creepage: "2950 mm",
        technical: {
          ratedVoltage: "63",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1095±15",
          arcingDistance: "930",
          shedDiameter: "145/110",
          minimumCreepage: "2950",
          impulseWithstand: "410",
          wetWithstand: "185",
          weight: "5.950",
        },
      },
      {
        code: "DPL110-3260-80/120BS",
        voltage: "110 kV",
        sectionLength: "1155±15 mm",
        creepage: "3260 mm",
        technical: {
          ratedVoltage: "110",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1155±15",
          arcingDistance: "990",
          shedDiameter: "145/110",
          minimumCreepage: "3260",
          impulseWithstand: "550",
          wetWithstand: "230",
          weight: "6.200",
        },
      },
      {
        code: "DPL110-3500-80/120BS",
        voltage: "110 kV",
        sectionLength: "1215±15 mm",
        creepage: "3500 mm",
        technical: {
          ratedVoltage: "110",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1215±15",
          arcingDistance: "1050",
          shedDiameter: "145/110",
          minimumCreepage: "3500",
          impulseWithstand: "550",
          wetWithstand: "230",
          weight: "6.450",
        },
      },
      {
        code: "DPL110-3740-80/120BS",
        voltage: "110 kV",
        sectionLength: "1275±15 mm",
        creepage: "3740 mm",
        technical: {
          ratedVoltage: "110",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1275±15",
          arcingDistance: "1110",
          shedDiameter: "145/110",
          minimumCreepage: "3740",
          impulseWithstand: "550",
          wetWithstand: "230",
          weight: "6.700",
        },
      },
      {
        code: "DPL110-3980-80/120BS",
        voltage: "110 kV",
        sectionLength: "1335±15 mm",
        creepage: "3980 mm",
        technical: {
          ratedVoltage: "110",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1335±15",
          arcingDistance: "1170",
          shedDiameter: "145/110",
          minimumCreepage: "3980",
          impulseWithstand: "550",
          wetWithstand: "230",
          weight: "6.900",
        },
      },
      {
        code: "DPL110-4220-80/120BS",
        voltage: "110 kV",
        sectionLength: "1395±15 mm",
        creepage: "4220 mm",
        technical: {
          ratedVoltage: "110",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1395±15",
          arcingDistance: "1230",
          shedDiameter: "145/110",
          minimumCreepage: "4220",
          impulseWithstand: "550",
          wetWithstand: "230",
          weight: "7.150",
        },
      },
    ],
  },
  {
    id: "suspension-tension-132-161",
    name: "132 & 161 kV Composite Suspension/Tension Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Suspension / Tension",
    catalogueRef: "DPL132 · DPL161 — 80/120 · 160/210 BS series",
    summary:
      "Composite suspension and tension insulators for 132 kV and 161 kV transmission lines. Ball-and-socket fittings with 80/120 kN and 160/210 kN mechanical load classes.",
    applications: "Transmission lines · Suspension & tension",
    voltageClass: "132 · 161 kV",
    standard: "IEC 61109 · IEC 61192",
    image: null,
    order: 14,
    variants: [
      {
        code: "DPL132-5160-80/120BS",
        voltage: "132 kV",
        sectionLength: "1460±25 mm",
        creepage: "5160 mm",
        technical: {
          ratedVoltage: "132",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1460±25",
          arcingDistance: "1340",
          shedDiameter: "160/125",
          minimumCreepage: "5160",
          impulseWithstand: "660",
          wetWithstand: "275",
          weight: "8.000",
        },
      },
      {
        code: "DPL132-5430-80/120BS",
        voltage: "132 kV",
        sectionLength: "1515±25 mm",
        creepage: "5160 mm",
        technical: {
          ratedVoltage: "132",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1515±25",
          arcingDistance: "1340",
          shedDiameter: "160/125",
          minimumCreepage: "5160",
          impulseWithstand: "660",
          wetWithstand: "275",
          weight: "8.300",
        },
      },
      {
        code: "DPL132-5430-80/120BS",
        voltage: "132 kV",
        sectionLength: "1575±25 mm",
        creepage: "5430 mm",
        technical: {
          ratedVoltage: "132",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1575±25",
          arcingDistance: "1400",
          shedDiameter: "160/125",
          minimumCreepage: "5430",
          impulseWithstand: "660",
          wetWithstand: "275",
          weight: "8.600",
        },
      },
      {
        code: "DPL132-5710-80/120BS",
        voltage: "132 kV",
        sectionLength: "1635±25 mm",
        creepage: "5710 mm",
        technical: {
          ratedVoltage: "132",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1635±25",
          arcingDistance: "1460",
          shedDiameter: "160/125",
          minimumCreepage: "5710",
          impulseWithstand: "660",
          wetWithstand: "275",
          weight: "9.100",
        },
      },
      {
        code: "DPL132-5960-80/120BS",
        voltage: "132 kV",
        sectionLength: "1695±25 mm",
        creepage: "5960 mm",
        technical: {
          ratedVoltage: "132",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1695±25",
          arcingDistance: "1520",
          shedDiameter: "160/125",
          minimumCreepage: "5960",
          impulseWithstand: "660",
          wetWithstand: "275",
          weight: "9.800",
        },
      },
      {
        code: "DPL132-5960-160/210BS",
        voltage: "132 kV",
        sectionLength: "1770±25 mm",
        creepage: "5960 mm",
        technical: {
          ratedVoltage: "132",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "1770±25",
          arcingDistance: "1520",
          shedDiameter: "160/125",
          minimumCreepage: "5960",
          impulseWithstand: "660",
          wetWithstand: "275",
          weight: "10.900",
        },
      },
      {
        code: "DPL161-5430-80/120BS",
        voltage: "161 kV",
        sectionLength: "1575±25 mm",
        creepage: "5430 mm",
        technical: {
          ratedVoltage: "161",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1575±25",
          arcingDistance: "1400",
          shedDiameter: "160/125",
          minimumCreepage: "5430",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "8.600",
        },
      },
      {
        code: "DPL161-5430-160/210BS",
        voltage: "161 kV",
        sectionLength: "1650±25 mm",
        creepage: "5430 mm",
        technical: {
          ratedVoltage: "161",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "1650±25",
          arcingDistance: "1400",
          shedDiameter: "160/125",
          minimumCreepage: "5430",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "9.700",
        },
      },
      {
        code: "DPL161-5710-80/120BS",
        voltage: "161 kV",
        sectionLength: "1635±25 mm",
        creepage: "5710 mm",
        technical: {
          ratedVoltage: "161",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1635±25",
          arcingDistance: "1460",
          shedDiameter: "160/125",
          minimumCreepage: "5710",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "9.100",
        },
      },
      {
        code: "DPL161-5710-160/210BS",
        voltage: "161 kV",
        sectionLength: "1710±25 mm",
        creepage: "5710 mm",
        technical: {
          ratedVoltage: "161",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "1710±25",
          arcingDistance: "1460",
          shedDiameter: "160/125",
          minimumCreepage: "5710",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "10.100",
        },
      },
      {
        code: "DPL161-5960-80/120BS",
        voltage: "161 kV",
        sectionLength: "1695±25 mm",
        creepage: "5960 mm",
        technical: {
          ratedVoltage: "161",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1695±25",
          arcingDistance: "1520",
          shedDiameter: "160/125",
          minimumCreepage: "5960",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "9.800",
        },
      },
      {
        code: "DPL161-5960-160/210BS",
        voltage: "161 kV",
        sectionLength: "1770±25 mm",
        creepage: "5960 mm",
        technical: {
          ratedVoltage: "161",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "1770±25",
          arcingDistance: "1520",
          shedDiameter: "160/125",
          minimumCreepage: "5960",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "10.900",
        },
      },
      {
        code: "DPL161-6240-80/120BS",
        voltage: "161 kV",
        sectionLength: "1755±25 mm",
        creepage: "6240 mm",
        technical: {
          ratedVoltage: "161",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1755±25",
          arcingDistance: "1580",
          shedDiameter: "160/125",
          minimumCreepage: "6240",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "10.100",
        },
      },
      {
        code: "DPL161-6240-160/210BS",
        voltage: "161 kV",
        sectionLength: "1830±25 mm",
        creepage: "6240 mm",
        technical: {
          ratedVoltage: "161",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "1830±25",
          arcingDistance: "1580",
          shedDiameter: "160/125",
          minimumCreepage: "6240",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "11.200",
        },
      },
      {
        code: "DPL161-6500-80/120BS",
        voltage: "161 kV",
        sectionLength: "1815±25 mm",
        creepage: "6500 mm",
        technical: {
          ratedVoltage: "161",
          sml: "80/120",
          couplingSize: "16",
          sectionLength: "1815±25",
          arcingDistance: "1640",
          shedDiameter: "160/125",
          minimumCreepage: "6500",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "10.400",
        },
      },
      {
        code: "DPL161-6500-160/210BS",
        voltage: "161 kV",
        sectionLength: "1890±25 mm",
        creepage: "6500 mm",
        technical: {
          ratedVoltage: "161",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "1890±25",
          arcingDistance: "1640",
          shedDiameter: "160/125",
          minimumCreepage: "6500",
          impulseWithstand: "805",
          wetWithstand: "335",
          weight: "11.500",
        },
      },
    ],
  },
  {
    id: "suspension-tension-220-230",
    name: "220 & 230 kV Composite Suspension/Tension Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Suspension / Tension",
    catalogueRef: "DPL220 · DPL230 — 120 · 160/210 BS series",
    summary:
      "Composite suspension and tension insulators for 220 kV and 230 kV transmission lines. Ball-and-socket fittings with 120 kN and 160/210 kN mechanical load classes.",
    applications: "Transmission lines · Suspension & tension",
    voltageClass: "220 · 230 kV",
    standard: "IEC 61109 · IEC 61192",
    image: null,
    order: 15,
    variants: [
      {
        code: "DPL220-7785-120BS",
        voltage: "220 kV",
        sectionLength: "2115±50 mm",
        creepage: "7785 mm",
        technical: {
          ratedVoltage: "220",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2115±50",
          arcingDistance: "1935",
          shedDiameter: "160/125",
          minimumCreepage: "7785",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "12",
        },
      },
      {
        code: "DPL220-7785-160/210BS",
        voltage: "220 kV",
        sectionLength: "2190±50 mm",
        creepage: "7785 mm",
        technical: {
          ratedVoltage: "220",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2190±50",
          arcingDistance: "1935",
          shedDiameter: "160/125",
          minimumCreepage: "7785",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "13",
        },
      },
      {
        code: "DPL220-8300-120BS",
        voltage: "220 kV",
        sectionLength: "2235±50 mm",
        creepage: "8300 mm",
        technical: {
          ratedVoltage: "220",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2235±50",
          arcingDistance: "2050",
          shedDiameter: "160/125",
          minimumCreepage: "8300",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "12.3",
        },
      },
      {
        code: "DPL220-8300-160/210BS",
        voltage: "220 kV",
        sectionLength: "2310±50 mm",
        creepage: "8300 mm",
        technical: {
          ratedVoltage: "220",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2310±50",
          arcingDistance: "2050",
          shedDiameter: "160/125",
          minimumCreepage: "8300",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "13.4",
        },
      },
      {
        code: "DPL220-8570-120BS",
        voltage: "220 kV",
        sectionLength: "2295±50 mm",
        creepage: "8570 mm",
        technical: {
          ratedVoltage: "220",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2295±50",
          arcingDistance: "2110",
          shedDiameter: "160/125",
          minimumCreepage: "8570",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "12.6",
        },
      },
      {
        code: "DPL220-8570-160/210BS",
        voltage: "220 kV",
        sectionLength: "2370±50 mm",
        creepage: "8570 mm",
        technical: {
          ratedVoltage: "220",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2370±50",
          arcingDistance: "2110",
          shedDiameter: "160/125",
          minimumCreepage: "8570",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "13.7",
        },
      },
      {
        code: "DPL220-8850-120BS",
        voltage: "220 kV",
        sectionLength: "2355±50 mm",
        creepage: "8850 mm",
        technical: {
          ratedVoltage: "220",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2355±50",
          arcingDistance: "2170",
          shedDiameter: "160/125",
          minimumCreepage: "8850",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "12.9",
        },
      },
      {
        code: "DPL220-8850-160/210BS",
        voltage: "220 kV",
        sectionLength: "2430±50 mm",
        creepage: "8850 mm",
        technical: {
          ratedVoltage: "220",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2430±50",
          arcingDistance: "2170",
          shedDiameter: "160/125",
          minimumCreepage: "8850",
          impulseWithstand: "1000",
          wetWithstand: "395",
          weight: "14",
        },
      },
      {
        code: "DPL230-7785-120BS",
        voltage: "230 kV",
        sectionLength: "2115±50 mm",
        creepage: "7785 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2115±50",
          arcingDistance: "1935",
          shedDiameter: "160/125",
          minimumCreepage: "7785",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "12",
        },
      },
      {
        code: "DPL230-7785-160/210BS",
        voltage: "230 kV",
        sectionLength: "2190±50 mm",
        creepage: "7785 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2190±50",
          arcingDistance: "1935",
          shedDiameter: "160/125",
          minimumCreepage: "7785",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "13",
        },
      },
      {
        code: "DPL230-8300-120BS",
        voltage: "230 kV",
        sectionLength: "2235±50 mm",
        creepage: "8300 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2235±50",
          arcingDistance: "2050",
          shedDiameter: "160/125",
          minimumCreepage: "8300",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "12.3",
        },
      },
      {
        code: "DPL230-8300-160/210BS",
        voltage: "230 kV",
        sectionLength: "2310±50 mm",
        creepage: "8300 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2310±50",
          arcingDistance: "2050",
          shedDiameter: "160/125",
          minimumCreepage: "8300",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "13.4",
        },
      },
      {
        code: "DPL230-8570-120BS",
        voltage: "230 kV",
        sectionLength: "2295±50 mm",
        creepage: "8570 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2295±50",
          arcingDistance: "2110",
          shedDiameter: "160/125",
          minimumCreepage: "8570",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "12.6",
        },
      },
      {
        code: "DPL230-8570-160/210BS",
        voltage: "230 kV",
        sectionLength: "2370±50 mm",
        creepage: "8570 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2370±50",
          arcingDistance: "2110",
          shedDiameter: "160/125",
          minimumCreepage: "8570",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "13.7",
        },
      },
      {
        code: "DPL230-8850-120BS",
        voltage: "230 kV",
        sectionLength: "2355±50 mm",
        creepage: "8850 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2355±50",
          arcingDistance: "2170",
          shedDiameter: "160/125",
          minimumCreepage: "8850",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "12.9",
        },
      },
      {
        code: "DPL230-8850-160/210BS",
        voltage: "230 kV",
        sectionLength: "2430±50 mm",
        creepage: "8850 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2430±50",
          arcingDistance: "2170",
          shedDiameter: "160/125",
          minimumCreepage: "8850",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "14",
        },
      },
      {
        code: "DPL230-9130-120BS",
        voltage: "230 kV",
        sectionLength: "2415±50 mm",
        creepage: "9130 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2415±50",
          arcingDistance: "2230",
          shedDiameter: "160/125",
          minimumCreepage: "9130",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "12.9",
        },
      },
      {
        code: "DPL230-9130-160/210BS",
        voltage: "230 kV",
        sectionLength: "2490±50 mm",
        creepage: "9130 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2490±50",
          arcingDistance: "2230",
          shedDiameter: "160/125",
          minimumCreepage: "9130",
          impulseWithstand: "1050",
          wetWithstand: "460",
          weight: "14",
        },
      },
      {
        code: "DPL230-9400-120BS",
        voltage: "230 kV",
        sectionLength: "2475±50 mm",
        creepage: "9400 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2475±50",
          arcingDistance: "2290",
          shedDiameter: "160/125",
          minimumCreepage: "9400",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      },
      {
        code: "DPL230-9400-160/210BS",
        voltage: "230 kV",
        sectionLength: "2550±50 mm",
        creepage: "9400 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2550±50",
          arcingDistance: "2290",
          shedDiameter: "160/125",
          minimumCreepage: "9400",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      },
      {
        code: "DPL230-9680-120BS",
        voltage: "230 kV",
        sectionLength: "2535±50 mm",
        creepage: "9680 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2535±50",
          arcingDistance: "2350",
          shedDiameter: "160/125",
          minimumCreepage: "9680",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      },
      {
        code: "DPL230-9680-160/210BS",
        voltage: "230 kV",
        sectionLength: "2610±50 mm",
        creepage: "9680 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2610±50",
          arcingDistance: "2350",
          shedDiameter: "160/125",
          minimumCreepage: "9680",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      },
      {
        code: "DPL230-9950-120BS",
        voltage: "230 kV",
        sectionLength: "2595±50 mm",
        creepage: "9950 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2595±50",
          arcingDistance: "2410",
          shedDiameter: "160/125",
          minimumCreepage: "9950",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      },
      {
        code: "DPL230-9950-160/210BS",
        voltage: "230 kV",
        sectionLength: "2670±50 mm",
        creepage: "9950 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2670±50",
          arcingDistance: "2410",
          shedDiameter: "160/125",
          minimumCreepage: "9950",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      },
      {
        code: "DPL230-10250-120BS",
        voltage: "230 kV",
        sectionLength: "2655±50 mm",
        creepage: "10250 mm",
        technical: {
          ratedVoltage: "230",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2655±50",
          arcingDistance: "2470",
          shedDiameter: "160/125",
          minimumCreepage: "10250",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      },
      {
        code: "DPL230-10250-160/210BS",
        voltage: "230 kV",
        sectionLength: "2730±50 mm",
        creepage: "10250 mm",
        technical: {
          ratedVoltage: "230",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "2730±50",
          arcingDistance: "2470",
          shedDiameter: "160/125",
          minimumCreepage: "10250",
          impulseWithstand: "1050",
          wetWithstand: "460",
        },
      }
    ],
  },
  {
    id: "suspension-tension-330",
    name: "330 kV Composite Suspension/Tension Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Suspension / Tension",
    catalogueRef: "DPL330 — 120 · 160/210 · 300 BS series",
    summary:
      "Composite suspension and tension insulators for 330 kV transmission lines. Ball-and-socket fittings with 120 kN, 160/210 kN, and 300 kN mechanical load classes.",
    applications: "Transmission lines · Suspension & tension",
    voltageClass: "330 kV",
    standard: "IEC 61109 · IEC 61192",
    image: null,
    order: 16,
    variants: [
      {
        code: "DPL330-11450-120BS",
        voltage: "330 kV",
        sectionLength: "2955±50 mm",
        creepage: "11450 mm",
        technical: {
          ratedVoltage: "330",
          sml: "120",
          couplingSize: "16",
          sectionLength: "2955±50",
          arcingDistance: "2770",
          shedDiameter: "160/125",
          minimumCreepage: "11450",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-11450-160/210BS",
        voltage: "330 kV",
        sectionLength: "3030±50 mm",
        creepage: "11450 mm",
        technical: {
          ratedVoltage: "330",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3030±50",
          arcingDistance: "2770",
          shedDiameter: "160/125",
          minimumCreepage: "11450",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-11450-300BS",
        voltage: "330 kV",
        sectionLength: "3090±50 mm",
        creepage: "11450 mm",
        technical: {
          ratedVoltage: "330",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3090±50",
          arcingDistance: "2770",
          shedDiameter: "160/125",
          minimumCreepage: "11450",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-11720-120BS",
        voltage: "330 kV",
        sectionLength: "3015±50 mm",
        creepage: "11720 mm",
        technical: {
          ratedVoltage: "330",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3015±50",
          arcingDistance: "2830",
          shedDiameter: "160/125",
          minimumCreepage: "11720",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-11720-160/210BS",
        voltage: "330 kV",
        sectionLength: "3105±50 mm",
        creepage: "11720 mm",
        technical: {
          ratedVoltage: "330",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3105±50",
          arcingDistance: "2830",
          shedDiameter: "160/125",
          minimumCreepage: "11720",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-11720-300BS",
        voltage: "330 kV",
        sectionLength: "3150±50 mm",
        creepage: "11720 mm",
        technical: {
          ratedVoltage: "330",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3150±50",
          arcingDistance: "2830",
          shedDiameter: "160/125",
          minimumCreepage: "11720",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12000-120BS",
        voltage: "330 kV",
        sectionLength: "3075±50 mm",
        creepage: "12000 mm",
        technical: {
          ratedVoltage: "330",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3075±50",
          arcingDistance: "2890",
          shedDiameter: "160/125",
          minimumCreepage: "12000",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12000-160/210BS",
        voltage: "330 kV",
        sectionLength: "3165±50 mm",
        creepage: "12000 mm",
        technical: {
          ratedVoltage: "330",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3165±50",
          arcingDistance: "2890",
          shedDiameter: "160/125",
          minimumCreepage: "12000",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12000-300BS",
        voltage: "330 kV",
        sectionLength: "3210±50 mm",
        creepage: "12000 mm",
        technical: {
          ratedVoltage: "330",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3210±50",
          arcingDistance: "2890",
          shedDiameter: "160/125",
          minimumCreepage: "12000",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12275-120BS",
        voltage: "330 kV",
        sectionLength: "3135±50 mm",
        creepage: "12275 mm",
        technical: {
          ratedVoltage: "330",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3135±50",
          arcingDistance: "2950",
          shedDiameter: "160/125",
          minimumCreepage: "12275",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12275-160/210BS",
        voltage: "330 kV",
        sectionLength: "3225±50 mm",
        creepage: "12275 mm",
        technical: {
          ratedVoltage: "330",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3225±50",
          arcingDistance: "2950",
          shedDiameter: "160/125",
          minimumCreepage: "12275",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12275-300BS",
        voltage: "330 kV",
        sectionLength: "3270±50 mm",
        creepage: "12275 mm",
        technical: {
          ratedVoltage: "330",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3270±50",
          arcingDistance: "2950",
          shedDiameter: "160/125",
          minimumCreepage: "12275",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12550-120BS",
        voltage: "330 kV",
        sectionLength: "3195±50 mm",
        creepage: "12550 mm",
        technical: {
          ratedVoltage: "330",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3195±50",
          arcingDistance: "3010",
          shedDiameter: "160/125",
          minimumCreepage: "12550",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12550-160/210BS",
        voltage: "330 kV",
        sectionLength: "3285±50 mm",
        creepage: "12550 mm",
        technical: {
          ratedVoltage: "330",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3285±50",
          arcingDistance: "3010",
          shedDiameter: "160/125",
          minimumCreepage: "12550",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12550-300BS",
        voltage: "330 kV",
        sectionLength: "3330±50 mm",
        creepage: "12550 mm",
        technical: {
          ratedVoltage: "330",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3330±50",
          arcingDistance: "3010",
          shedDiameter: "160/125",
          minimumCreepage: "12550",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12820-120BS",
        voltage: "330 kV",
        sectionLength: "3255±50 mm",
        creepage: "12820 mm",
        technical: {
          ratedVoltage: "330",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3255±50",
          arcingDistance: "3070",
          shedDiameter: "160/125",
          minimumCreepage: "12820",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12820-160/210BS",
        voltage: "330 kV",
        sectionLength: "3345±50 mm",
        creepage: "12820 mm",
        technical: {
          ratedVoltage: "330",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3345±50",
          arcingDistance: "3070",
          shedDiameter: "160/125",
          minimumCreepage: "12820",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      },
      {
        code: "DPL330-12820-300BS",
        voltage: "330 kV",
        sectionLength: "3390±50 mm",
        creepage: "12820 mm",
        technical: {
          ratedVoltage: "330",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3390±50",
          arcingDistance: "3070",
          shedDiameter: "160/125",
          minimumCreepage: "12820",
          impulseWithstand: ">1500",
          wetWithstand: "950",
        },
      }
    ],
  },
  {
    id: "suspension-tension-400",
    name: "400 kV Composite Suspension/Tension Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Suspension / Tension",
    catalogueRef: "DPL400 — 120 · 160/210 · 300 BS series",
    summary:
      "Composite suspension and tension insulators for 400 kV transmission lines. Ball-and-socket fittings with 120 kN, 160/210 kN, and 300 kN mechanical load classes.",
    applications: "Transmission lines · Suspension & tension",
    voltageClass: "400 kV",
    standard: "IEC 61109 · IEC 61192",
    image: null,
    order: 17,
    variants: [
      {
        code: "DPL400-13800-120BS",
        voltage: "400 kV",
        sectionLength: "3435±50 mm",
        creepage: "13800 mm",
        technical: {
          ratedVoltage: "400",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3435±50",
          arcingDistance: "3250",
          shedDiameter: "160/125",
          minimumCreepage: "13800",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-13800-160/210BS",
        voltage: "400 kV",
        sectionLength: "3510±50 mm",
        creepage: "13800 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3510±50",
          arcingDistance: "3250",
          shedDiameter: "160/125",
          minimumCreepage: "13800",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-13800-300BS",
        voltage: "400 kV",
        sectionLength: "3570±50 mm",
        creepage: "13800 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3570±50",
          arcingDistance: "3250",
          shedDiameter: "160/125",
          minimumCreepage: "13800",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-14150-120BS",
        voltage: "400 kV",
        sectionLength: "3555±50 mm",
        creepage: "14150 mm",
        technical: {
          ratedVoltage: "400",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3555±50",
          arcingDistance: "3370",
          shedDiameter: "160/125",
          minimumCreepage: "14150",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-14150-160/210BS",
        voltage: "400 kV",
        sectionLength: "3630±50 mm",
        creepage: "14150 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3630±50",
          arcingDistance: "3370",
          shedDiameter: "160/125",
          minimumCreepage: "14150",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-14150-300BS",
        voltage: "400 kV",
        sectionLength: "3690±50 mm",
        creepage: "14150 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3690±50",
          arcingDistance: "3370",
          shedDiameter: "160/125",
          minimumCreepage: "14150",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-14420-120BS",
        voltage: "400 kV",
        sectionLength: "3615±50 mm",
        creepage: "14420 mm",
        technical: {
          ratedVoltage: "400",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3615±50",
          arcingDistance: "3430",
          shedDiameter: "160/125",
          minimumCreepage: "14420",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-14420-160/210BS",
        voltage: "400 kV",
        sectionLength: "3690±50 mm",
        creepage: "14420 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3690±50",
          arcingDistance: "3430",
          shedDiameter: "160/125",
          minimumCreepage: "14420",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-14420-300BS",
        voltage: "400 kV",
        sectionLength: "3750±50 mm",
        creepage: "14420 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3750±50",
          arcingDistance: "3430",
          shedDiameter: "160/125",
          minimumCreepage: "14420",
          impulseWithstand: ">1900",
          wetWithstand: ">680",
        },
      },
      {
        code: "DPL400-14700-120BS",
        voltage: "400 kV",
        sectionLength: "3675±50 mm",
        creepage: "14700 mm",
        technical: {
          ratedVoltage: "400",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3675±50",
          arcingDistance: "3490",
          shedDiameter: "160/125",
          minimumCreepage: "14700",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-14700-160/210BS",
        voltage: "400 kV",
        sectionLength: "3750±50 mm",
        creepage: "14700 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3750±50",
          arcingDistance: "3490",
          shedDiameter: "160/125",
          minimumCreepage: "14700",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-14700-300BS",
        voltage: "400 kV",
        sectionLength: "3810±50 mm",
        creepage: "14700 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3810±50",
          arcingDistance: "3490",
          shedDiameter: "160/125",
          minimumCreepage: "14700",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-14950-120BS",
        voltage: "400 kV",
        sectionLength: "3735±50 mm",
        creepage: "14950 mm",
        technical: {
          ratedVoltage: "400",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3735±50",
          arcingDistance: "3550",
          shedDiameter: "160/125",
          minimumCreepage: "14950",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-14950-160/210BS",
        voltage: "400 kV",
        sectionLength: "3810±50 mm",
        creepage: "14950 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3810±50",
          arcingDistance: "3550",
          shedDiameter: "160/125",
          minimumCreepage: "14950",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-14950-300BS",
        voltage: "400 kV",
        sectionLength: "3870±50 mm",
        creepage: "14950 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3870±50",
          arcingDistance: "3550",
          shedDiameter: "160/125",
          minimumCreepage: "14950",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-15470-120BS",
        voltage: "400 kV",
        sectionLength: "3855±50 mm",
        creepage: "15470 mm",
        technical: {
          ratedVoltage: "400",
          sml: "120",
          couplingSize: "16",
          sectionLength: "3855±50",
          arcingDistance: "3670",
          shedDiameter: "160/125",
          minimumCreepage: "15470",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-15470-160/210BS",
        voltage: "400 kV",
        sectionLength: "3930±50 mm",
        creepage: "15470 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "3930±50",
          arcingDistance: "3670",
          shedDiameter: "160/125",
          minimumCreepage: "15470",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-15470-300BS",
        voltage: "400 kV",
        sectionLength: "3990±50 mm",
        creepage: "15470 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "3990±50",
          arcingDistance: "3670",
          shedDiameter: "160/125",
          minimumCreepage: "15470",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-16000-160/210BS",
        voltage: "400 kV",
        sectionLength: "4050±50 mm",
        creepage: "16000 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "4050±50",
          arcingDistance: "3790",
          shedDiameter: "160/125",
          minimumCreepage: "16000",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-16000-300BS",
        voltage: "400 kV",
        sectionLength: "4110±50 mm",
        creepage: "16000 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "4110±50",
          arcingDistance: "3790",
          shedDiameter: "160/125",
          minimumCreepage: "16000",
          impulseWithstand: ">1900",
          wetWithstand: ">720",
        },
      },
      {
        code: "DPL400-16450-160/210BS",
        voltage: "400 kV",
        sectionLength: "4170±50 mm",
        creepage: "16450 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "4170±50",
          arcingDistance: "3910",
          shedDiameter: "160/125",
          minimumCreepage: "16450",
          impulseWithstand: ">2200",
          wetWithstand: ">800",
        },
      },
      {
        code: "DPL400-16450-300BS",
        voltage: "400 kV",
        sectionLength: "4230±50 mm",
        creepage: "16450 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "4230±50",
          arcingDistance: "3910",
          shedDiameter: "160/125",
          minimumCreepage: "16450",
          impulseWithstand: ">2200",
          wetWithstand: ">800",
        },
      },
      {
        code: "DPL400-16900-160/210BS",
        voltage: "400 kV",
        sectionLength: "4230±50 mm",
        creepage: "16900 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "4230±50",
          arcingDistance: "3980",
          shedDiameter: "160/125",
          minimumCreepage: "16900",
          impulseWithstand: ">2300",
          wetWithstand: ">800",
        },
      },
      {
        code: "DPL400-16900-300BS",
        voltage: "400 kV",
        sectionLength: "4290±50 mm",
        creepage: "16900 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "4290±50",
          arcingDistance: "3980",
          shedDiameter: "160/125",
          minimumCreepage: "16900",
          impulseWithstand: ">2300",
          wetWithstand: ">800",
        },
      },
      {
        code: "DPL400-17160-160/210BS",
        voltage: "400 kV",
        sectionLength: "4290±50 mm",
        creepage: "17160 mm",
        technical: {
          ratedVoltage: "400",
          sml: "160/210",
          couplingSize: "20",
          sectionLength: "4290±50",
          arcingDistance: "4040",
          shedDiameter: "160/125",
          minimumCreepage: "17160",
          impulseWithstand: ">2300",
          wetWithstand: ">800",
        },
      },
      {
        code: "DPL400-17160-300BS",
        voltage: "400 kV",
        sectionLength: "4350±50 mm",
        creepage: "17160 mm",
        technical: {
          ratedVoltage: "400",
          sml: "300",
          couplingSize: "24",
          sectionLength: "4350±50",
          arcingDistance: "4040",
          shedDiameter: "160/125",
          minimumCreepage: "17160",
          impulseWithstand: ">2300",
          wetWithstand: ">800",
        },
      }
    ],
  },
  {
    id: "interphase-spacer-mv",
    name: "Interphase Spacer — Medium Voltage",
    family: "Silicone Composite Insulators",
    subFamily: "Interphase Spacer",
    catalogueRef: "DPL MV · phase-to-phase",
    summary:
      "Medium-voltage phase-to-phase composite spacer with armour grip suspension. Prevents flashover between conductors under galloping, wind and ice loading.",
    applications: "Distribution line galloping control",
    voltageClass: "up to 33 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 21,
  },
  {
    id: "interphase-spacer-hv",
    name: "Interphase Spacer — High Voltage",
    family: "Silicone Composite Insulators",
    subFamily: "Interphase Spacer",
    catalogueRef: "DPL 63 · 132 · 230 · 400 T.T",
    summary:
      "High-voltage phase-to-phase composite spacer. Stabilizes line geometry on long spans, controls galloping amplitude and maintains electrical clearance to earthed structures.",
    applications: "Transmission line spacer · AGS mounted",
    voltageClass: "66 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 22,
    variants: [
      { code: "DPL 63 T.T", voltage: "63 kV", notes: "Phase-to-phase spacer" },
      { code: "DPL 132 T.T", voltage: "132 kV", notes: "Phase-to-phase spacer" },
      { code: "DPL 230 T.T", voltage: "230 kV", notes: "Phase-to-phase spacer" },
      { code: "DPL 400 T.T", voltage: "400 kV", notes: "Phase-to-phase spacer" },
    ],
  },
  {
    id: "line-post-pin-type",
    name: "Line Post Insulator (Pin-Type)",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "DPL 20-550/620/700 · DPL 33-980/1180/1440",
    summary:
      "Composite pin-type line post for distribution hardware. Large-diameter FRP core absorbs cantilever and bending loads while the silicone housing maintains hydrophobicity.",
    applications: "Distribution line post",
    voltageClass: "20 – 33 kV",
    standard: "IEC 61109 · IEC 62217 · IEC 60120",
    image: null,
    order: 31,
    variants: [
      { code: "DPL 20-550", voltage: "20 kV", sectionLength: "550 mm" },
      { code: "DPL 20-620", voltage: "20 kV", sectionLength: "620 mm" },
      { code: "DPL 20-700", voltage: "20 kV", sectionLength: "700 mm" },
      { code: "DPL 33-980", voltage: "33 kV", sectionLength: "980 mm" },
      { code: "DPL 33-1180", voltage: "33 kV", sectionLength: "1180 mm" },
      { code: "DPL 33-1440", voltage: "33 kV", sectionLength: "1440 mm" },
    ],
  },
  {
    id: "line-post-cross-arm",
    name: "Line Post Insulator (Cross-Arm)",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "Cross-arm line post",
    summary:
      "Insulated cross-arm geometry for compact line configurations. Enables voltage upgrades inside existing corridors and reduces right-of-way requirements.",
    applications: "Compact lines · Urban & forest ROW",
    voltageClass: "20 · 33 · 63 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 32,
    variants: [
      { code: "DPL 20 CA", voltage: "20 kV", notes: "Cross-arm class" },
      { code: "DPL 33 CA", voltage: "33 kV", notes: "Cross-arm class" },
      { code: "DPL 63 CA", voltage: "63 kV", notes: "Cross-arm class" },
    ],
  },
  {
    id: "line-post-pivot-type",
    name: "Line Post Insulator (Pivot Type)",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "DPL 63-2340 · 132-4520 · 230-9860 · 400-14120 LP",
    summary:
      "Pivot-type line post engineered for high-voltage overhead lines with fluctuating conductor angles. Combines silicone and fiberglass for severe outdoor duty.",
    applications: "HV overhead lines · Flexible angles",
    voltageClass: "63 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 33,
    variants: [
      { code: "DPL 63-2340 LP", voltage: "63 kV", sectionLength: "2340 mm" },
      { code: "DPL 132-4520 LP", voltage: "132 kV", sectionLength: "4520 mm" },
      { code: "DPL 230-9860 LP", voltage: "230 kV", sectionLength: "9860 mm" },
      { code: "DPL 400-14120 LP", voltage: "400 kV", sectionLength: "14120 mm" },
    ],
  },
  {
    id: "station-post-insulator",
    name: "Station Post Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "DPL 173/204/325/650/1050/1550 PI",
    summary:
      "Busbar and station-class post insulator for substation mechanical support combined with electrical insulation duty up to 420 kV.",
    applications: "Substation busbar · Station post",
    voltageClass: "20 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 34,
    variants: [
      { code: "DPL 173 PI", voltage: "up to 52 kV", sectionLength: "173 mm" },
      { code: "DPL 204 PI", voltage: "up to 72.5 kV", sectionLength: "204 mm" },
      { code: "DPL 325 PI", voltage: "up to 123 kV", sectionLength: "325 mm" },
      { code: "DPL 650 PI", voltage: "up to 170 kV", sectionLength: "650 mm" },
      { code: "DPL 1050 PI", voltage: "up to 245 kV", sectionLength: "1050 mm" },
      { code: "DPL 1550 PI", voltage: "up to 420 kV", sectionLength: "1550 mm" },
    ],
  },
  {
    id: "railway-insulator-type-1",
    name: "Railway Insulator — Type 1",
    family: "Silicone Composite Insulators",
    subFamily: "Railway",
    catalogueRef: "Railway Type 1 · 610 / 770 mm",
    summary:
      "Type 1 composite railway insulator for electrified catenary. Short section length with 6 – 8 kN cantilever and 60 – 80 kN tension rating.",
    applications: "Railway catenary · Type 1",
    voltageClass: "25 kV AC",
    standard: "Railway IEC standards",
    image: null,
    order: 41,
    variants: [
      {
        code: "DPL Railway T1-610",
        voltage: "25 kV AC",
        sectionLength: "610 mm",
        notes: "6 kN cantilever · 60 kN tension",
      },
      {
        code: "DPL Railway T1-770",
        voltage: "25 kV AC",
        sectionLength: "770 mm",
        notes: "8 kN cantilever · 80 kN tension",
      },
    ],
  },
  {
    id: "railway-insulator-type-2",
    name: "Railway Insulator — Type 2",
    family: "Silicone Composite Insulators",
    subFamily: "Railway",
    catalogueRef: "Railway Type 2 · 820 mm",
    summary:
      "Type 2 railway insulator with increased section length and 12 kN cantilever / 100 kN tension load. Creepage 1400 mm for medium pollution routes.",
    applications: "Railway catenary · Type 2",
    voltageClass: "25 kV AC",
    standard: "Railway IEC standards",
    image: null,
    order: 42,
    variants: [
      {
        code: "DPL Railway T2-820",
        voltage: "25 kV AC",
        sectionLength: "820 mm",
        creepage: "1400 mm",
        notes: "12 kN cantilever · 100 kN tension",
      },
    ],
  },
  {
    id: "railway-insulator-type-3",
    name: "Railway Insulator — Type 3",
    family: "Silicone Composite Insulators",
    subFamily: "Railway",
    catalogueRef: "Railway Type 3 · 880 mm",
    summary:
      "Heavy-duty Type 3 railway insulator with 16 kN cantilever and 120 kN tension load. 8,000 N·m torsion rating for severe dynamic rail duty.",
    applications: "Railway catenary · Type 3 heavy duty",
    voltageClass: "25 kV AC",
    standard: "Railway IEC standards",
    image: null,
    order: 43,
    variants: [
      {
        code: "DPL Railway T3-880",
        voltage: "25 kV AC",
        sectionLength: "880 mm",
        notes: "16 kN cantilever · 120 kN tension · 8,000 N·m torsion",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 02 · Hybrid Insulators (Silicone – Ceramic)
  // ────────────────────────────────────────────────────────────
  {
    id: "hybrid-pin-type",
    name: "Hybrid Pin-Type Insulator",
    family: "Hybrid Insulators",
    subFamily: "Silicone – Ceramic",
    catalogueRef: "DPL 20-760/790/880 · DPL 33-990/1080",
    summary:
      "Hybrid line post combining the mechanical rigidity of a porcelain core with silicone hydrophobicity. Patented Taban Niroo family engineered for polluted environments.",
    applications: "Distribution pin-type · Polluted zones",
    voltageClass: "20 – 33 kV",
    standard: "IEC 62896 · IEC 62217 · IEC 60383-1",
    image: null,
    order: 11,
    variants: [
      { code: "DPL 20-760 H-L", voltage: "20 kV", sectionLength: "760 mm" },
      { code: "DPL 20-790 H-L", voltage: "20 kV", sectionLength: "790 mm" },
      { code: "DPL 20-880 H-P", voltage: "20 kV", sectionLength: "880 mm" },
      { code: "DPL 33-990 H-L", voltage: "33 kV", sectionLength: "990 mm" },
      { code: "DPL 33-1080 H-P", voltage: "33 kV", sectionLength: "1080 mm" },
    ],
  },
  {
    id: "hybrid-post",
    name: "Hybrid Post Insulator",
    family: "Hybrid Insulators",
    subFamily: "Silicone – Ceramic",
    catalogueRef: "DPL 325 · 650 · 1050 · 1800 HPI",
    summary:
      "Station-class hybrid post with porcelain core and silicone housing. Thinner sheds, extended creepage and superior pollution performance for industrial, desert and coastal sites.",
    applications: "Substation post · Industrial · Coastal",
    voltageClass: "63 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 12,
    variants: [
      { code: "DPL 325 HPI", voltage: "up to 123 kV", sectionLength: "325 mm" },
      { code: "DPL 650 HPI", voltage: "up to 170 kV", sectionLength: "650 mm" },
      { code: "DPL 1050 HPI", voltage: "up to 245 kV", sectionLength: "1050 mm" },
      { code: "DPL 1800 HPI", voltage: "up to 420 kV", sectionLength: "1800 mm" },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 03 · Transformer Bushings
  // ────────────────────────────────────────────────────────────
  {
    id: "polymer-bushing",
    name: "Polymer Bushing",
    family: "Transformer Bushings",
    subFamily: "Polymer",
    catalogueRef: "DPL 11-510 · 20-828 · 33-1180 · 52-1570 B",
    summary:
      "Lightweight silicone-housed transformer bushing with excellent anti-pollution, anti-UV and explosion-resistant performance. No surface coating or regular washing required.",
    applications: "Transformer interface · Switchgear",
    voltageClass: "11 – 52 kV",
    standard: "IEC 60137",
    image: null,
    order: 11,
    variants: [
      { code: "DPL 11-510 B", voltage: "11 kV", sectionLength: "510 mm" },
      { code: "DPL 20-828 B", voltage: "20 kV", sectionLength: "828 mm" },
      { code: "DPL 33-1180 B", voltage: "33 kV", sectionLength: "1180 mm" },
      { code: "DPL 52-1570 B", voltage: "52 kV", sectionLength: "1570 mm" },
    ],
  },
  {
    id: "station-post-hybrid-bushing-ceramic",
    name: "Station Post Hybrid Bushing — Silicone-Ceramic",
    family: "Transformer Bushings",
    subFamily: "Station Post Hybrid",
    catalogueRef: "DPL 20-690 · 33-1012 PB (ceramic)",
    summary:
      "Hybrid bushing combining porcelain and silicone for station posts, power transformers and circuit breakers. UV and pollution resistant with reduced flashover risk.",
    applications: "Substation · Power transformer",
    voltageClass: "20 – 33 kV",
    standard: "IEC 60137",
    image: null,
    order: 21,
    variants: [
      { code: "DPL 20-690 PB", voltage: "20 kV", sectionLength: "690 mm" },
      { code: "DPL 33-1012 PB", voltage: "33 kV", sectionLength: "1012 mm" },
    ],
  },
  {
    id: "station-post-hybrid-bushing-resin",
    name: "Station Post Hybrid Bushing — Silicone-Resin",
    family: "Transformer Bushings",
    subFamily: "Station Post Hybrid",
    catalogueRef: "DPL 20-860-630 · 33-1430-630",
    summary:
      "Silicone-resin variant of the station post hybrid bushing for indoor / outdoor substations with long operational life and low maintenance.",
    applications: "Indoor · Outdoor substations",
    voltageClass: "20 – 33 kV",
    standard: "IEC 60137",
    image: null,
    order: 22,
    variants: [
      {
        code: "DPL 20-860-630",
        voltage: "20 kV",
        sectionLength: "860 mm",
        notes: "Lower section 630 mm",
      },
      {
        code: "DPL 33-1430-630",
        voltage: "33 kV",
        sectionLength: "1430 mm",
        notes: "Lower section 630 mm",
      },
    ],
  },
  {
    id: "plug-in-bushing",
    name: "Plug In Bushing",
    family: "Transformer Bushings",
    subFamily: "Plug In",
    catalogueRef: "Plug in bushing",
    summary:
      "Plug-in transformer bushing for compact switchgear and transformer interfaces. Quick installation geometry and reliable sealing against moisture and dust.",
    applications: "Compact switchgear · Transformer plug-in",
    voltageClass: "up to 52 kV",
    standard: "IEC 60137",
    image: null,
    order: 31,
  },
  {
    id: "hollow-core-insulator",
    name: "",
    family: "Transformer Bushings",
    subFamily: "Hollow Core",
    catalogueRef: "Hollow core insulator",
    summary:
      "Silicone-housed hollow core insulator for instrument transformers, circuit breakers and bushings. Explosion-resistant profile with homogeneous electrical field distribution.",
    applications: "Instrument transformers · Circuit breakers",
    voltageClass: "up to 420 kV",
    standard: "IEC 60137 · IEC 62155",
    image: "/images/new-release-hollow-core.jpg",
    order: 41,
  },

  // ────────────────────────────────────────────────────────────
  // 04 · Cable Accessories
  // ────────────────────────────────────────────────────────────
  {
    id: "outdoor-termination",
    name: "Outdoor Termination",
    family: "Cable Accessories",
    subFamily: "Terminations",
    catalogueRef: "DPL-TS063 · TS0132 · TS0230",
    summary:
      "Outdoor termination for high-voltage underground cables connecting to overhead lines, switchgears and transformers. Hydrophobic silicone sheds for severe outdoor exposure.",
    applications: "HV cable to overhead interface",
    voltageClass: "63 – 230 kV",
    standard: "IEC standards",
    image: null,
    order: 11,
    variants: [
      { code: "DPL-TS063", voltage: "63 kV", notes: "Outdoor termination" },
      { code: "DPL-TS0132", voltage: "132 kV", notes: "Outdoor termination" },
      { code: "DPL-TS0230", voltage: "230 kV", notes: "Outdoor termination" },
    ],
  },
  {
    id: "silicone-joint",
    name: "Silicone Joint — Cross-Bonding & Straight",
    family: "Cable Accessories",
    subFamily: "Joints",
    catalogueRef: "DPL JXH / JSH 63-132 · JXH / JSH 230",
    summary:
      "Silicone cross-bonding and straight joints for HV cable networks. Stress-controlled sealing designed for long service under moisture and contamination.",
    applications: "HV cable joints",
    voltageClass: "132 – 230 kV",
    standard: "IEC standards",
    image: null,
    order: 12,
    variants: [
      { code: "JXH 63-132", voltage: "63 – 132 kV", notes: "Cross-bonding joint" },
      { code: "JSH 63-132", voltage: "63 – 132 kV", notes: "Straight joint" },
      { code: "JXH 230", voltage: "230 kV", notes: "Cross-bonding joint" },
      { code: "JSH 230", voltage: "230 kV", notes: "Straight joint" },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 05 · Overhead Feeder Line Composite
  // ────────────────────────────────────────────────────────────
  {
    id: "cutout-fuse-type-a",
    name: "Composite Cut Out Fuse — Type A",
    family: "Overhead Feeder Line Composite",
    subFamily: "Cut Out Fuse",
    catalogueRef: "DPL 20-1345-100 CU · DPL 33-1850-100 CU",
    summary:
      "Composite-housed cutout fuse protecting transformers and lines from overcurrent events. Weather-resistant body, serves as manual isolator during maintenance.",
    applications: "Distribution protection · Isolation",
    voltageClass: "20 – 33 kV",
    standard: "IEC standards",
    image: null,
    order: 11,
    variants: [
      {
        code: "DPL 20-1345-100 CU",
        voltage: "20 kV",
        sectionLength: "1345 mm",
        notes: "Type A · 100 A",
      },
      {
        code: "DPL 33-1850-100 CU",
        voltage: "33 kV",
        sectionLength: "1850 mm",
        notes: "Type A · 100 A",
      },
    ],
  },
  {
    id: "cutout-fuse-type-b",
    name: "Composite Cut Out Fuse — Type B",
    family: "Overhead Feeder Line Composite",
    subFamily: "Cut Out Fuse",
    catalogueRef: "DPL 20-1450-100 CU · DPL 33-1850-100 CU",
    summary:
      "Type B variant of the composite cut out fuse family with extended creepage for polluted distribution feeders.",
    applications: "Distribution protection · Polluted zones",
    voltageClass: "20 – 33 kV",
    standard: "IEC standards",
    image: null,
    order: 12,
    variants: [
      {
        code: "DPL 20-1450-100 CU",
        voltage: "20 kV",
        sectionLength: "1450 mm",
        notes: "Type B · 100 A",
      },
      {
        code: "DPL 33-1850-100 CU",
        voltage: "33 kV",
        sectionLength: "1850 mm",
        notes: "Type B · 100 A",
      },
    ],
  },
  {
    id: "surge-arrester",
    name: "Composite Surge Arrester (Distribution)",
    family: "Overhead Feeder Line Composite",
    subFamily: "Surge Arrester",
    catalogueRef: "Distribution class arrester",
    summary:
      "Distribution-class composite surge arrester protecting equipment from lightning, switching and temporary overvoltage events with ground lead disconnector.",
    applications: "Substation · Distribution line protection",
    voltageClass: "24 – 36 kV",
    standard: "IEC 60099-4 · ANSI C62.11",
    image: null,
    order: 21,
  },

  // ────────────────────────────────────────────────────────────
  // 06 · Creepage Extenders & Covers
  // ────────────────────────────────────────────────────────────
  {
    id: "creepage-line",
    name: "Creepage Extender — Line Insulator",
    family: "Creepage Extenders & Covers",
    subFamily: "Creepage Extender",
    catalogueRef: "Retrofit creepage extender",
    summary:
      "Retrofit creepage extender for line insulators. Increases surface leakage path in polluted or coastal environments without replacing the insulator.",
    applications: "Retrofit · Line insulators",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 11,
  },
  {
    id: "creepage-post",
    name: "Creepage Extender — Post Insulator",
    family: "Creepage Extenders & Covers",
    subFamily: "Creepage Extender",
    catalogueRef: "Retrofit creepage extender",
    summary:
      "Retrofit creepage extender for post insulators. Extends creepage distance to reduce surface discharges and the risk of flashover.",
    applications: "Retrofit · Post insulators",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 12,
  },
  {
    id: "silicone-wire-cover",
    name: "Silicone Wire Cover",
    family: "Creepage Extenders & Covers",
    subFamily: "Covers",
    catalogueRef: "Silicone wire cover",
    summary:
      "Silicone cover for overhead line conductors. Improves insulation at close-proximity points and reduces wildlife-related faults.",
    applications: "Conductor protection",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 21,
  },
  {
    id: "bird-repellent-cover",
    name: "Bird-Repellent Insulator Cover",
    family: "Creepage Extenders & Covers",
    subFamily: "Covers",
    catalogueRef: "Bird repellent cover",
    summary:
      "Protective cover with bird-repellent geometry reducing animal-induced outages on exposed insulators and hardware.",
    applications: "Animal-induced outage prevention",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 22,
  },
  {
    id: "composite-insulator-cover",
    name: "Composite Insulator Cover",
    family: "Creepage Extenders & Covers",
    subFamily: "Covers",
    catalogueRef: "Composite insulator cover",
    summary:
      "Protective silicone cover for insulators in polluted environments. Extends maintenance intervals and reduces leakage currents.",
    applications: "Insulator protection",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 23,
  },
];

const FAMILY_ORDER = [
  "Silicone Composite Insulators",
  "Hybrid Insulators",
  "Transformer Bushings",
  "Cable Accessories",
  "Overhead Feeder Line Composite",
  "Creepage Extenders & Covers",
] as const;

const FAMILY_INDEX: Record<string, string> = {
  "Silicone Composite Insulators": "01",
  "Hybrid Insulators": "02",
  "Transformer Bushings": "03",
  "Cable Accessories": "04",
  "Overhead Feeder Line Composite": "05",
  "Creepage Extenders & Covers": "06",
};

const FAMILY_SHORT: Record<string, string> = {
  "Silicone Composite Insulators": "Composite",
  "Hybrid Insulators": "Hybrid",
  "Transformer Bushings": "Bushings",
  "Cable Accessories": "Cable",
  "Overhead Feeder Line Composite": "Feeder line",
  "Creepage Extenders & Covers": "Creepage",
};

const FAMILY_ANCHOR: Record<string, string> = {
  "Silicone Composite Insulators": "cat-silicone-composite-insulators",
  "Hybrid Insulators": "cat-hybrid-insulators",
  "Transformer Bushings": "cat-transformer-bushings",
  "Cable Accessories": "cat-cable-accessories",
  "Overhead Feeder Line Composite": "cat-overhead-feeder",
  "Creepage Extenders & Covers": "cat-creepage-extenders",
};

function toSpec(item: ProductItem): ProductSpec {
  return {
    id: item.id,
    name: item.name,
    family: item.family,
    subFamily: item.subFamily,
    catalogueRef: item.catalogueRef,
    summary: item.summary,
    applications: item.applications,
    voltageClass: item.voltageClass,
    standard: item.standard,
    image: item.image ?? null,
    variants: item.variants,
  };
}

/**
 * Blueprint-style placeholder displayed when a product still has no image.
 * Swap in a real Image by setting `image` on the product item.
 */
function ProductVisual({
  item,
  codeLabel,
}: {
  item: ProductItem;
  codeLabel: string;
}) {
  if (item.image) {
    return (
      <>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/45 px-2 py-0.5 font-mono text-[10px] tracking-wider text-white backdrop-blur-sm">
          {codeLabel}
        </div>
        {item.voltageClass && (
          <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/45 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {item.voltageClass}
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-muted/50 dark:bg-white/[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 32px)",
      }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,var(--surface-glow),transparent_70%)] opacity-80" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="font-hero-slogan text-[clamp(2.2rem,5vw,3.4rem)] font-bold tracking-tight text-foreground/25">
          {codeLabel}
        </span>
        <span className="max-w-[16rem] text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/50">
          {item.subFamily}
        </span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80">
          Image placeholder
        </span>
      </div>
      {item.voltageClass && (
        <div className="absolute right-3 top-3 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground/70 backdrop-blur-sm">
          {item.voltageClass}
        </div>
      )}
    </div>
  );
}

type ModalState = { item: ProductItem; view: ProductModalView } | null;

/**
 * Product card surface.
 *
 * Design intent: the two documentation options the user keeps asking for —
 * "Technical table" and "Product drawing" — must be visible on the card
 * itself, not hidden one click deep. The card is therefore split into:
 *   1. A clickable visual/title region that opens the overview/picker.
 *   2. Two explicit action buttons that jump straight to Table or Drawing.
 *
 * Nested interactive elements are implemented as sibling buttons inside an
 * article (never buttons-inside-buttons) to stay semantically valid.
 */
function ProductCard({
  item,
  codeLabel,
  onOpen,
}: {
  item: ProductItem;
  codeLabel: string;
  onOpen: (item: ProductItem, view?: ProductModalView) => void;
}) {
  return (
    <article className="group interactive-lift relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/90 text-left shadow-elevate dark:border-white/[0.08] dark:bg-card/50">
      <button
        type="button"
        onClick={() => onOpen(item, "picker")}
        aria-label={`Open ${item.name} overview`}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-t-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      >
        <ProductVisual item={item} codeLabel={codeLabel} />
      </button>

      <div className="flex flex-1 flex-col gap-3 border-t border-border/30 p-5 dark:border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {item.subFamily}
          </span>
          {item.voltageClass && (
            <span className="rounded-full border border-foreground/20 bg-foreground/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground/80">
              {item.voltageClass}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpen(item, "picker")}
          className="text-left text-base font-semibold leading-snug tracking-tight text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground md:text-lg"
        >
          {item.name}
        </button>

        {/* Two primary options — exactly as requested: clicking either opens
            the corresponding content inside the product modal on this page. */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpen(item, "table")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label={`View technical table for ${item.name}`}
          >
            <Table2 size={13} aria-hidden strokeWidth={1.75} />
            Table
          </button>
          <button
            type="button"
            onClick={() => onOpen(item, "drawing")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label={`View drawing for ${item.name}`}
          >
            <Ruler size={13} aria-hidden strokeWidth={1.75} />
            Drawing
          </button>
        </div>

        <Link
          href={`/products/${item.id}`}
          className="mt-2 inline-flex items-center gap-1 self-start text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          aria-label={`Open detail page for ${item.name}`}
        >
          Detail page
          <ArrowUpRight
            size={11}
            aria-hidden
            strokeWidth={1.75}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}

export function ProductCatalogSection() {
  const [query, setQuery] = useState("");
  const [activeFamily, setActiveFamily] = useState<string>("All");
  const [modalState, setModalState] = useState<ModalState>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  /**
   * A single entry point for opening a product. Callers pass which view the
   * modal should land on so the two card-level shortcuts ("Table" / "Drawing")
   * go straight to the relevant content instead of forcing an extra step.
   */
  const openProduct = useCallback(
    (item: ProductItem, view: ProductModalView = "picker") => {
      setModalState({ item, view });
    },
    [],
  );

  const orderedFamilies = useMemo(
    () => FAMILY_ORDER.filter((f) => PRODUCT_ITEMS.some((p) => p.family === f)),
    [],
  );

  const familyCounts = useMemo(() => {
    const c: Record<string, number> = { All: PRODUCT_ITEMS.length };
    for (const f of orderedFamilies) {
      c[f] = PRODUCT_ITEMS.filter((p) => p.family === f).length;
    }
    return c;
  }, [orderedFamilies]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCT_ITEMS.filter((item) => {
      const familyOk = activeFamily === "All" || item.family === activeFamily;
      if (!familyOk) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.family.toLowerCase().includes(q) ||
        item.subFamily.toLowerCase().includes(q) ||
        item.catalogueRef.toLowerCase().includes(q) ||
        item.applications.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.voltageClass ?? "").toLowerCase().includes(q)
      );
    });
  }, [activeFamily, query]);

  /**
   * Groups results by family only. Sub-family is surfaced as a small tag on
   * each card rather than a third header level, so the catalogue reads as a
   * simple two-level tree (Family → Products) and stops overwhelming users.
   */
  const groupedFiltered = useMemo(() => {
    const map: Record<string, ProductItem[]> = {};
    for (const item of filteredItems) {
      if (!map[item.family]) map[item.family] = [];
      map[item.family]!.push(item);
    }
    for (const family of Object.keys(map)) {
      map[family]!.sort((a, b) => a.order - b.order);
    }
    return map;
  }, [filteredItems]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const entry = Object.entries(FAMILY_ANCHOR).find(([, a]) => a === hash);
    if (entry) setActiveFamily(entry[0]);
  }, []);

  const closeModal = useCallback(() => setModalState(null), []);

  return (
    <section
      id="product-explorer"
      ref={sectionRef}
      className="scroll-mt-28 border-y border-border/50 bg-background dark:border-white/[0.06]"
    >
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sticky family navigator */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Product range
            </p>
            <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground">
              Browse by family
            </h2>

            <nav
              aria-label="Product family navigator"
              className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-card/90 shadow-elevate dark:border-white/[0.08] dark:bg-card/50"
            >
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveFamily("All")}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border-b border-border/40 px-4 py-3 text-left text-sm transition-colors dark:border-white/[0.06]",
                      activeFamily === "All"
                        ? "bg-muted/40 text-foreground"
                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                    )}
                    aria-pressed={activeFamily === "All"}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        00
                      </span>
                      <span className="font-medium">All products</span>
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {familyCounts.All}
                    </span>
                  </button>
                </li>
                {orderedFamilies.map((family, i) => {
                  const isActive = activeFamily === family;
                  const isLast = i === orderedFamilies.length - 1;
                  return (
                    <li key={family}>
                      <button
                        type="button"
                        onClick={() => setActiveFamily(family)}
                        className={cn(
                          "flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition-colors",
                          !isLast &&
                            "border-b border-border/40 dark:border-white/[0.06]",
                          isActive
                            ? "bg-muted/40 text-foreground"
                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                        )}
                        aria-pressed={isActive}
                      >
                        <span className="flex items-start gap-3">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {FAMILY_INDEX[family]}
                          </span>
                          <span className="font-medium leading-snug">
                            {family}
                          </span>
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {familyCounts[family] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-6 rounded-2xl border border-border/40 bg-muted/30 p-5 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Procurement
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Need a custom configuration, drawing or test report?
              </p>
              <a
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:text-foreground/70"
              >
                Engineering request
                <ArrowRight size={14} aria-hidden />
              </a>
            </div>
          </aside>

          <div>
            {activeFamily !== "All" && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {activeFamily}
              </p>
            )}
            <h3 className="font-hero-slogan mt-3 text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              {filteredItems.length} product
              {filteredItems.length === 1 ? "" : "s"}
              <span className="text-foreground/45">
                {activeFamily === "All" && !query.trim()
                  ? " across all families."
                  : " match your filter."}
              </span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Every product card offers two quick views:{" "}
              <span className="text-foreground">Table</span> for ratings and
              dimensions, <span className="text-foreground">Drawing</span> for
              the sectional diagram. Both open in place — you never leave the
              page.
            </p>

            {/* Mobile family chips — keep the sidebar nav reachable on small screens */}
            <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setActiveFamily("All")}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors",
                  activeFamily === "All"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={activeFamily === "All"}
              >
                All · {familyCounts.All}
              </button>
              {orderedFamilies.map((family) => {
                const isActive = activeFamily === family;
                return (
                  <button
                    key={family}
                    type="button"
                    onClick={() => setActiveFamily(family)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                    aria-pressed={isActive}
                  >
                    {FAMILY_SHORT[family] ?? family} · {familyCounts[family] ?? 0}
                  </button>
                );
              })}
            </div>

            {/* Search + counters */}
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/90 p-3 shadow-elevate dark:border-white/[0.08] dark:bg-card/50 md:flex-row md:items-center md:justify-between md:p-4">
              <div className="relative w-full md:max-w-[380px]">
                <Search
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search product, application, voltage or DPL code"
                  className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-9 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                  aria-label="Search products"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X size={14} aria-hidden />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="rounded-full border border-border bg-background px-2.5 py-1">
                  Total {PRODUCT_ITEMS.length}
                </span>
                <span className="rounded-full border border-foreground bg-foreground px-2.5 py-1 text-background">
                  Showing {filteredItems.length}
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="mt-10">
              {filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No products match the current search. Try another keyword
                    or reset the family filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveFamily("All");
                    }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:text-foreground/70"
                  >
                    Reset filters
                    <ArrowRight size={14} aria-hidden />
                  </button>
                </div>
              ) : (
                <div className="space-y-14">
                  {orderedFamilies
                    .filter((f) => groupedFiltered[f])
                    .map((family) => {
                      const items = groupedFiltered[family]!;
                      // Hide the family header when the user has already
                      // scoped the view to a single family — avoids a redundant
                      // title and lets the grid read as a clean result list.
                      const showFamilyHeader =
                        activeFamily === "All" && !query.trim();

                      return (
                        <section
                          key={family}
                          id={FAMILY_ANCHOR[family]}
                          className="scroll-mt-28"
                        >
                          {showFamilyHeader && (
                            <div className="mb-6 flex items-end justify-between gap-4 border-b border-border/40 pb-4 dark:border-white/[0.06]">
                              <div className="flex items-end gap-3">
                                <span className="font-mono text-xs text-muted-foreground">
                                  {FAMILY_INDEX[family]}
                                </span>
                                <h4 className="font-hero-slogan text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
                                  {family}
                                </h4>
                              </div>
                              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                {items.length} item
                                {items.length === 1 ? "" : "s"}
                              </span>
                            </div>
                          )}

                          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((item, idx) => {
                              const codeLabel = `${FAMILY_INDEX[family]}.${String(
                                idx + 1,
                              ).padStart(2, "0")}`;
                              return (
                                <li key={item.id}>
                                  <ProductCard
                                    item={item}
                                    codeLabel={codeLabel}
                                    onOpen={openProduct}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        open={modalState !== null}
        product={modalState ? toSpec(modalState.item) : null}
        initialView={modalState?.view ?? "picker"}
        onClose={closeModal}
      />
    </section>
  );
}
