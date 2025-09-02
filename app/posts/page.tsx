import axios from "axios";
import Image from "next/image";

export default async function PostsPage() {
  const res = await fetch('https://www.apicountries.com/name/switzerland');
  const posts = await res.json();
  let test = await axios.get('https://www.apicountries.com/countries')
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.error(err);
    });

  return (
    <div>
      <h1>Posts</h1>
      <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
        <li>{posts[0].name} {posts[0].region} {posts[0].capital} {posts[0].independent}</li>
        <Image src={posts[0].flag} alt="flag" width={100} height={100} />
      </ol>
      <ul>
        {test.map((country: any) => (
          <li key={country.name}>{country.name} - {country.alpha2Code}</li>
        ))}
      </ul>
    </div>
  );
}