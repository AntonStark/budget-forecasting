import Link from "next/link";

export default function Checkpoint() {
    return (
        <div>
            Checkpoint form will be there

            <p>
                <Link href="/main">
                    <input type="button" value="Go back"/>
                </Link>
            </p>
        </div>
    )
}
