type Props = {
  params: { lang: string };
};

export default function PricingPage({ params }: Props) {
  return (
    <div>
      <h1>Pricing ({params.lang})</h1>
    </div>
  );
}
