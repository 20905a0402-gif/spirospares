import { notFound } from "next/navigation";
import ModelSparesCatalog from "@/components/sections/ModelSparesCatalog";
import { getLegacyBikeById, getLegacyBikes, getLegacySpareParts } from "@/lib/sanity/queries-data";

type BikeSparesPageProps = {
  params: {
    modelId: string;
  };
};

export async function generateStaticParams() {
  const bikes = await getLegacyBikes();
  return bikes.map((bike) => ({ modelId: bike.id }));
}

export default async function BikeSparesPage({ params }: BikeSparesPageProps) {
  const bike = await getLegacyBikeById(params.modelId);

  if (!bike) {
    notFound();
  }

  const parts = (await getLegacySpareParts()).filter((part) => part.compatible_models.includes(bike.name));

  return <ModelSparesCatalog bike={bike} parts={parts} />;
}