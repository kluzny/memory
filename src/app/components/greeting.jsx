export default function Greeting() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl my-4">Welcome to Memory!</h2>
      <ol className="text-2xl list-decimal">
        <li>
          <p>Add players on the left</p>
        </li>
        <li>
          <p>Choose a game size</p>
        </li>
      </ol>
    </div>
  )
}