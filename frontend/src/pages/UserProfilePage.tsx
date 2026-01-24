import { useAuth } from "../provider/AuthProvider";

export function UserProfilePage(){
    const {
        user : User,
        actions: {
            // getProfile,
            editProfile
        }
    } = useAuth();
    return (
        <>
            <div style={{ padding: 20 }}>
                <h1>User Profile</h1>
                {/* <button onClick={() => getProfile?.()}>Refresh</button> */}

                {User ? (
                    <div style={{ marginTop: 16 }}>
                        <p><strong>ID:</strong> {User.id ?? "—"}</p>
                        <p><strong>First Name:</strong> {User.firstName ?? "—"}</p>
                        <p><strong>Last Name:</strong> {User.lastName ?? "—"}</p>
                        <p><strong>Email:</strong> {User.email ?? "—"}</p>
                        {/* {User.avatar && (
                            <div style={{ marginTop: 8 }}>
                                <img src={User.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: 8 }} />
                            </div>
                        )} */}
                        <div style={{ marginTop: 12 }}>
                            <strong>Raw data:</strong>
                            <pre style={{ background: "#f5f5f5", padding: 8 }}>{JSON.stringify(User, null, 2)}</pre>
                        </div>
                    </div>
                ) : (
                    <p>No user data available.</p>
                )}
            </div>
        </>
    )
}

export default UserProfilePage;