import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
}

export default function CategoriesSidebar({ categories }: { categories: Category[] }) {
  const vetements = ['Pull', 'Top', 'Pantalon', 'T-shirt', 'Veste']
  const accessoires = ['Sacs']

  const vetementCats = categories.filter(c => vetements.includes(c.name))
  const accessoireCats = categories.filter(c => accessoires.includes(c.name))

  return (
    <div>
      <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: 12, letterSpacing: 1, color: '#3E3125' }}>
        Vêtements
      </h6>
      <ul className="list-unstyled mb-4">
        {vetementCats.map(cat => (
          <li key={cat.id} className="mb-2">
            <Link 
              href={`/produits?category=${cat.slug}`}
              className="text-decoration-none d-block py-1"
              style={{ color: '#6F4E37', fontSize: 14, borderBottom: '1px solid #eee' }}
            >
              {cat.name.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>

      <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: 12, letterSpacing: 1, color: '#3E3125' }}>
        Accessoires
      </h6>
      <ul className="list-unstyled">
        {accessoireCats.map(cat => (
          <li key={cat.id} className="mb-2">
            <Link 
              href={`/produits?category=${cat.slug}`}
              className="text-decoration-none d-block py-1"
              style={{ color: '#6F4E37', fontSize: 14, borderBottom: '1px solid #eee' }}
            >
              {cat.name.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}