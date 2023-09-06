import { gql, useQuery } from '@apollo/client'
import './index.css'
import { TailSpin } from 'react-loader-spinner'
interface PastLaunches {
    mission_name: string,
    launch_date_local: Date,
    rocket: {
        rocket_name: string
    }
    links: {
        article_link: string,
        video_link: string
    }
}

const GET_HISTORIES = gql`
  query getHistories($offset:Int,$limit:Int){
    launchesPast(offset:$offset,limit:$limit) {
        mission_name
        launch_date_local
        rocket {
          rocket_name
        }
       links {
         article_link
         video_link
       }
      }
  }
`

const DisplayResult = () => {
    const { data, loading,error, fetchMore } = useQuery(GET_HISTORIES, {
        variables: {
            offset: 0,
            limit: 10
        }
    })

    if (error) {
        return <h1>Something Went Wrong</h1>
    }
    if (loading) {
        return <div className='loader-container'><TailSpin /></div>
    }

    return (
        <div className='bg-container'>
            <ul className='launches-list'>
                {data &&
                    data.launchesPast.map((launch: PastLaunches, ind: number) => (
                        <li key={launch.mission_name} onMouseEnter={() => {
                            if(data?.launchesPast?.length-1 === ind){
                                fetchMore({variables:{
                                    offset: data.launchesPast.length,
                                    limit:data.launchesPast.length+10
                                }})
                            }
                        }} className='list-item'>
                            <h1>Mission Name: {launch.mission_name}</h1>
                            <p>Launch Date: {String(launch.launch_date_local)}</p>
                            <p>Rocket Name: {launch.rocket?.rocket_name}</p>
                            <p>Article Link: <a target='_blank' href={launch.links.article_link}>{launch.links.article_link}</a></p>
                            <p>Video Link: <a target='_blank' href={launch.links.video_link}>{launch.links.video_link}</a></p>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default DisplayResult