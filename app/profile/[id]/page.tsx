type PropsType = {
    params: {
        id: string;
    }
};

export default function ProfilePage({ params: { id } }: PropsType) {
    return (
        <main className="h-screen w-full">
            <h1 className="text-4xl text-center p-4">Profile</h1>
            <p className="text-center">User ID: {id}</p>
        </main>
    );
}