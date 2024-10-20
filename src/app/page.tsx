import Button from '../components/Button';

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Domain Discovery</h1>
      <p className="text-xl mb-4">
        Find available, lucrative, short, and catchy domain names based on specific patterns.
      </p>
      <div className="space-x-4">
        <Button variant="primary">Search Domains</Button>
        <Button variant="secondary">Learn More</Button>
      </div>
    </div>
  );
}
