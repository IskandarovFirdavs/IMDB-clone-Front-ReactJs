import TitleCard from "./TitleCard"

const TitleList = ({ titles, title }) => {
  return (
    <div className="mb-8">
      {title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {titles.map((title) => (
          <TitleCard key={title.id} title={title} />
        ))}
      </div>
    </div>
  )
}

export default TitleList
