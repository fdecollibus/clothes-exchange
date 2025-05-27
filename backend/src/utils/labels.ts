export function getCategoryLabel(category: string): string {
  const labels: { [key: string]: string } = {
    kleidung: 'Kleidung',
    schuhe: 'Schuhe',
    spielzeug: 'Spielzeug',
    accessoires: 'Accessoires'
  };
  return labels[category] || category;
}

export function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    available: 'Verfügbar',
    sold: 'Verkauft',
    reserved: 'Reserviert'
  };
  return labels[status] || status;
}

// Predefined set of pastel colors that are easy to read
const sellerColors = [
  '#FFB3BA', // Light pink
  '#BAFFC9', // Light green
  '#BAE1FF', // Light blue
  '#FFFFBA', // Light yellow
  '#FFE4BA', // Light orange
  '#E4BAFF', // Light purple
  '#BAFFE4', // Light mint
  '#FFBAE4', // Light magenta
  '#E4FFBA', // Light lime
  '#BAE4FF', // Light sky blue
  '#FFBAFF', // Light fuchsia
  '#BAFFBA', // Light chartreuse
  '#FFE4E4', // Light salmon
  '#E4E4FF', // Light lavender
  '#E4FFE4', // Light spring green
  '#FFE4FF', // Light plum
  '#E4FFE4', // Light mint
  '#FFE4E4', // Light peach
  '#E4E4FF', // Light periwinkle
  '#E4FFE4', // Light sage
];

export const getSellerColor = (sellerNumber: string): string => {
  // Convert seller number to a number and use modulo to get an index
  const num = parseInt(sellerNumber.replace(/\D/g, ''), 10);
  const index = (num - 1) % sellerColors.length;
  return sellerColors[index] || '#FFFFFF'; // Default to white if something goes wrong
}; 