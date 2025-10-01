import { useParams } from "react-router-dom"

export function Redirect() {
  const params = useParams()

  return (
    <h1>{params.shortUrlSuffix}</h1>
  )
}