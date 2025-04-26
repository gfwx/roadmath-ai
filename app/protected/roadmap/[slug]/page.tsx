interface RoadmapPageProps {
  params: { slug: string };
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const slug = (await params).slug;
  return (
    <div>
      <h2>This is the roadmap page for: {slug}</h2>
    </div>
  );
}
