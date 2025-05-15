import PersonCard from "./PersonCard"

const PersonList = ({ people, title }) => {
  return (
    <div className="mb-8">
      {title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {people.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  )
}

export default PersonList
