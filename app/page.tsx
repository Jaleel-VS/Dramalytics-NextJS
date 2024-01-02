import Image from 'next/image'

export default function Home() {
  return (
    <main className="container w-full mx-auto">
      <h1>Home</h1>
      {/* button + link to about page */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <a href="/about">About</a>
      </button>

    </main>
  )
}
