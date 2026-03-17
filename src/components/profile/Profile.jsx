import './Profile.css'

export default function Profile({user, postcount}){
return (
       <div className="profile">
                <div class="profile-name-image">
                    <img src={user.image} alt={user.desc}/>
                    <h1 class="profile-user-name">{user.titre}</h1>
                </div>
                <div className="profile-bio">
                    <p>{user.texte}</p>
                </div>
                <div className="profile-stats">
                    <ul>
                        <li>{postcount} posts</li>
                        <li>188 followers</li>
                        <li>206 following</li>
                    </ul>
                </div>
            </div>
    )
}


