import { z } from "zod";
import { FAMILY_ORDER } from "@/lib/products";
import { LOCALES } from "@/lib/i18n";

const familySchema = z.enum(
  FAMILY_ORDER as unknown as [string, ...string[]],
);

const localizedStringSchema = z.union([
  z.string().max(5000),
  z
    .object({
      en: z.string().max(5000),
      fa: z.string().max(5000).optional(),
    })
    .strict(),
]);

const localizedNameSchema = z.union([
  z.string().trim().min(1).max(200),
  z
    .object({
      en: z.string().trim().min(1).max(200),
      fa: z.string().max(200).optional(),
    })
    .strict(),
]);

const technicalRowSchema = z
  .object({
    shedNo: z.string().max(120).optional(),
    ratedVoltage: z.string().max(120).optional(),
    sml: z.string().max(120).optional(),
    couplingSize: z.string().max(120).optional(),
    sectionLength: z.string().max(120).optional(),
    arcingDistance: z.string().max(120).optional(),
    shedDiameter: z.string().max(120).optional(),
    shedSpacing: z.string().max(120).optional(),
    minimumCreepage: z.string().max(120).optional(),
    impulseWithstand: z.string().max(120).optional(),
    impulseNegative: z.string().max(120).optional(),
    dryWithstand: z.string().max(120).optional(),
    wetWithstand: z.string().max(120).optional(),
    weight: z.string().max(120).optional(),
  })
  .strict();

const variantSchema = z
  .object({
    code: z.string().min(1).max(120),
    voltage: z.string().min(1).max(120),
    sectionLength: z.string().max(120).optional(),
    creepage: z.string().max(120).optional(),
    notes: z.string().max(2000).optional(),
    technical: technicalRowSchema.optional(),
  })
  .strict();

export const productIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "id must be kebab-case (a-z, 0-9, hyphens)",
  });

export const productSchema = z
  .object({
    id: productIdSchema,
    name: localizedNameSchema,
    family: familySchema,
    subFamily: localizedNameSchema,
    catalogueRef: z.string().trim().max(200),
    summary: localizedStringSchema,
    applications: localizedStringSchema,
    voltageClass: z.string().max(200).optional(),
    standard: z.string().max(500).optional(),
    image: z.string().max(2000).nullable().optional(),
    order: z.number().int().min(0).max(10_000),
    hidden: z.boolean().optional(),
    variants: z.array(variantSchema).max(200).optional(),
  })
  .strict();

export const productsPutSchema = z
  .object({
    products: z.array(productSchema).max(500),
  })
  .strict();

export const productPatchSchema = productSchema.partial().strict();

export const loginSchema = z
  .object({
    username: z.string().trim().min(1).max(120),
    password: z.string().min(1).max(500),
  })
  .strict();

const localeSchema = z.enum(LOCALES as unknown as [string, ...string[]]);

export const blogCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(300),
    slug: z.string().trim().max(80).optional(),
    excerpt: z.string().max(2000).optional(),
    body: z.string().max(200_000).optional(),
    coverImage: z.string().max(2000).nullable().optional(),
    status: z.enum(["draft", "published"]).optional(),
    locale: localeSchema.optional(),
  })
  .strict();

export const blogPatchSchema = z
  .object({
    title: z.string().trim().min(1).max(300).optional(),
    slug: z.string().trim().max(80).optional(),
    excerpt: z.string().max(2000).optional(),
    body: z.string().max(200_000).optional(),
    coverImage: z.string().max(2000).nullable().optional(),
    status: z.enum(["draft", "published"]).optional(),
    locale: localeSchema.optional(),
  })
  .strict();

const contentItemSchema = z
  .object({
    label: z.string().max(500),
    value: z.string().max(4000).optional(),
    body: z.string().max(20_000).optional(),
  })
  .strict();

const contentBlockSchema = z
  .object({
    eyebrow: z.string().max(500).optional(),
    title: z.string().max(1000).optional(),
    titleLine2: z.string().max(1000).optional(),
    titleLine3: z.string().max(1000).optional(),
    body: z.string().max(50_000).optional(),
    image: z.string().max(2000).nullable().optional(),
    ctaLabel: z.string().max(200).optional(),
    ctaHref: z.string().max(500).optional(),
    ctaLabel2: z.string().max(200).optional(),
    ctaHref2: z.string().max(500).optional(),
    items: z.array(contentItemSchema).max(100).optional(),
  })
  .strict();

const pageBlocks = z.record(z.string(), contentBlockSchema.optional()).optional();

export const siteContentPutSchema = z
  .object({
    version: z.literal(1).optional(),
    updatedAt: z.string().optional(),
    home: pageBlocks,
    about: pageBlocks,
    projects: pageBlocks,
    contact: pageBlocks,
    products: pageBlocks,
    blog: pageBlocks,
    legal: pageBlocks,
    footer: contentBlockSchema.optional(),
  })
  .strict();

export const galleryItemUpdateSchema = z
  .object({
    id: z.string().min(1).max(120),
    alt: z.string().max(500).optional(),
    src: z.string().max(2000).optional(),
    pathname: z.string().max(2000).optional(),
  })
  .strict();

export const galleryPutSchema = z
  .object({
    items: z.array(galleryItemUpdateSchema).max(200),
  })
  .strict();

export const galleryDeleteSchema = z
  .object({
    id: z.string().min(1).max(120),
  })
  .strict();

export const contactSchema = z
  .object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(320),
    company: z.string().max(200).optional().default(""),
    message: z.string().min(10).max(8000),
    productRef: z
      .string()
      .trim()
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, {
        message: "productRef must be kebab-case or empty",
      })
      .optional()
      .default(""),
    _hp: z.string().optional(),
    _t: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

export const newsletterSchema = z
  .object({
    email: z.string().email().max(320),
    _hp: z.string().optional(),
    _t: z.union([z.number(), z.string()]).optional(),
  })
  .strict();
