import {
  PrismaClient,
  ReorderPriority,
  ReorderStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const WAREHOUSES = [
  {
    code: "WC-DC-01",
    name: "West Coast Distribution Center",
    city: "Los Angeles",
    region: "CA",
    country: "US",
    capacity: 50000,
  },
  {
    code: "EC-DC-01",
    name: "East Coast Distribution Center",
    city: "Newark",
    region: "NJ",
    country: "US",
    capacity: 45000,
  },
  {
    code: "CA-HUB-01",
    name: "Canada Fulfillment Hub",
    city: "Vancouver",
    region: "BC",
    country: "CA",
    capacity: 30000,
  },
] as const;

interface ProductSeed {
  sku: string;
  name: string;
  category: string;
  size: string;
  color: string;
  style: string;
  material: string;
  cost: number;
  retailPrice: number;
  baseDemand: number;
  trendBias: number;
}

const PRODUCTS: ProductSeed[] = [
  {
    sku: "LL-ALIGN-25-BLK-M",
    name: "Align High-Rise Legging 25\"",
    category: "Activewear",
    size: "M",
    color: "Black",
    style: "Legging",
    material: "Nulu",
    cost: 28,
    retailPrice: 98,
    baseDemand: 4,
    trendBias: 1.15,
  },
  {
    sku: "LL-SWIFT-SEA-M",
    name: "Swift Speed HR Tight 28\"",
    category: "Activewear",
    size: "M",
    color: "Seafoam",
    style: "Legging",
    material: "Luxtreme",
    cost: 32,
    retailPrice: 108,
    baseDemand: 3,
    trendBias: 1.05,
  },
  {
    sku: "AR-WL-COAT-BLK-S",
    name: "Wilfred Wool Cocoon Coat",
    category: "Outerwear",
    size: "S",
    color: "Black",
    style: "Coat",
    material: "Wool Blend",
    cost: 95,
    retailPrice: 298,
    baseDemand: 1,
    trendBias: 0.9,
  },
  {
    sku: "NK-AM90-WHT-10",
    name: "Air Max 90",
    category: "Footwear",
    size: "10",
    color: "White",
    style: "Sneaker",
    material: "Leather/Mesh",
    cost: 55,
    retailPrice: 130,
    baseDemand: 5,
    trendBias: 1.2,
  },
  {
    sku: "NK-DRI-FIT-L-BLU",
    name: "Dri-FIT Training Top",
    category: "Activewear",
    size: "L",
    color: "Blue",
    style: "Tee",
    material: "Polyester",
    cost: 14,
    retailPrice: 35,
    baseDemand: 6,
    trendBias: 1.0,
  },
  {
    sku: "EL-ANR-WL-30ML",
    name: "Advanced Night Repair Serum",
    category: "Beauty",
    size: "30ml",
    color: "N/A",
    style: "Serum",
    material: "Skincare",
    cost: 42,
    retailPrice: 98,
    baseDemand: 3,
    trendBias: 1.08,
  },
  {
    sku: "SH-HOOD-GRY-M",
    name: "Classic Relaxed Hoodie",
    category: "Loungewear",
    size: "M",
    color: "Heather Grey",
    style: "Hoodie",
    material: "Cotton Fleece",
    cost: 18,
    retailPrice: 58,
    baseDemand: 4,
    trendBias: 1.12,
  },
  {
    sku: "AZ-BLAZ-NAV-6",
    name: "Babaton Conan Blazer",
    category: "Outerwear",
    size: "6",
    color: "Navy",
    style: "Blazer",
    material: "Crepe",
    cost: 48,
    retailPrice: 168,
    baseDemand: 2,
    trendBias: 0.95,
  },
  {
    sku: "LL-EBB-BLK-O/S",
    name: "Everywhere Belt Bag 1L",
    category: "Accessories",
    size: "O/S",
    color: "Black",
    style: "Belt Bag",
    material: "Nylon",
    cost: 12,
    retailPrice: 38,
    baseDemand: 7,
    trendBias: 1.25,
  },
  {
    sku: "NK-TECH-FLEECE-M",
    name: "Tech Fleece Joggers",
    category: "Loungewear",
    size: "M",
    color: "Charcoal",
    style: "Jogger",
    material: "Tech Fleece",
    cost: 28,
    retailPrice: 110,
    baseDemand: 4,
    trendBias: 1.1,
  },
  {
    sku: "LL-DEFINE-JCK-PNK-S",
    name: "Define Jacket Nulu",
    category: "Activewear",
    size: "S",
    color: "Pink Pearl",
    style: "Jacket",
    material: "Nulu",
    cost: 35,
    retailPrice: 118,
    baseDemand: 3,
    trendBias: 1.18,
  },
  {
    sku: "AR-CONDOR-BLK-4",
    name: "The Super Puff™ Shorty",
    category: "Outerwear",
    size: "4",
    color: "Black",
    style: "Puffer",
    material: "Gloss Ripstop",
    cost: 72,
    retailPrice: 225,
    baseDemand: 2,
    trendBias: 1.3,
  },
];

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

function daysAhead(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.reorder.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.trendData.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  console.log("Seeding warehouses...");
  const warehouses = await Promise.all(
    WAREHOUSES.map((w) => prisma.warehouse.create({ data: w })),
  );

  console.log("Seeding products, inventory, trends, and predictions...");
  const createdProducts = [];

  for (const product of PRODUCTS) {
    const created = await prisma.product.create({
      data: {
        sku: product.sku,
        name: product.name,
        category: product.category,
        size: product.size,
        color: product.color,
        style: product.style,
        material: product.material,
        cost: product.cost,
        retailPrice: product.retailPrice,
      },
    });
    createdProducts.push({ ...product, id: created.id });

    for (let w = 0; w < warehouses.length; w++) {
      const warehouse = warehouses[w];
      const variance = pseudoRandom(w * 17 + product.sku.length);
      const quantity = Math.round(
        product.baseDemand * 30 * (0.6 + variance * 0.8) * (w === 0 ? 1.2 : 0.9),
      );
      const safetyStock = Math.max(10, Math.round(product.baseDemand * 14));
      const leadTimeDays = warehouse.country === "CA" ? 12 : 7;

      await prisma.inventoryItem.create({
        data: {
          productId: created.id,
          warehouseId: warehouse.id,
          quantity,
          safetyStock,
          leadTimeDays,
        },
      });
    }

    for (let day = 56; day >= 0; day -= 7) {
      const recordedAt = daysAgo(day);
      const seasonal = 1 + 0.1 * Math.sin((day / 56) * Math.PI);
      const noise = 0.85 + pseudoRandom(day + product.sku.charCodeAt(0)) * 0.3;
      const trendScore = Math.min(
        100,
        Math.round(product.trendBias * seasonal * noise * 72 * 10) / 10,
      );

      await prisma.trendData.create({
        data: {
          productId: created.id,
          source: day % 14 === 0 ? "social_scrape" : "search_index",
          trendScore,
          recordedAt,
        },
      });
    }

    for (let day = 0; day < 30; day++) {
      const forecastDate = daysAhead(day);
      const weekendBoost = [0, 6].includes(forecastDate.getDay()) ? 1.15 : 1;
      const noise = 0.8 + pseudoRandom(day * 3 + product.baseDemand) * 0.4;
      const predictedDemand = Math.max(
        1,
        Math.round(product.baseDemand * weekendBoost * noise * product.trendBias),
      );
      const confidence =
        Math.round((0.78 + pseudoRandom(day + 5) * 0.18) * 1000) / 1000;

      await prisma.prediction.create({
        data: {
          productId: created.id,
          forecastDate,
          predictedDemand,
          confidence,
          horizonDays: 30,
        },
      });
    }
  }

  console.log("Seeding reorders...");
  const reorderCandidates = [
    {
      productIndex: 0,
      warehouseIndex: 1,
      quantity: 240,
      status: ReorderStatus.PENDING,
      priority: ReorderPriority.HIGH,
      notes: "Align Black M trending +18% — expedite before stockout",
    },
    {
      productIndex: 3,
      warehouseIndex: 0,
      quantity: 180,
      status: ReorderStatus.APPROVED,
      priority: ReorderPriority.CRITICAL,
      notes: "Air Max 90 White — below lead-time coverage at WC-DC",
    },
    {
      productIndex: 8,
      warehouseIndex: 2,
      quantity: 500,
      status: ReorderStatus.ORDERED,
      priority: ReorderPriority.NORMAL,
      notes: "Belt bag evergreen SKU — quarterly replenishment",
    },
    {
      productIndex: 11,
      warehouseIndex: 0,
      quantity: 90,
      status: ReorderStatus.PENDING,
      priority: ReorderPriority.HIGH,
      notes: "Super Puff seasonal spike — cold snap forecast",
    },
    {
      productIndex: 5,
      warehouseIndex: 1,
      quantity: 120,
      status: ReorderStatus.RECEIVED,
      priority: ReorderPriority.LOW,
      notes: "ANR serum restock completed",
    },
  ];

  for (const reorder of reorderCandidates) {
    const product = createdProducts[reorder.productIndex];
    const warehouse = warehouses[reorder.warehouseIndex];

    await prisma.reorder.create({
      data: {
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: reorder.quantity,
        status: reorder.status,
        priority: reorder.priority,
        notes: reorder.notes,
        recommendedAt: daysAgo(reorder.status === ReorderStatus.RECEIVED ? 14 : 2),
      },
    });
  }

  console.log(
    `Seed complete: ${PRODUCTS.length} products, ${warehouses.length} warehouses`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
