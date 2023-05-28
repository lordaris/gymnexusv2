import CoachLayout from "../../../../components/ui/coachLayout";
import Image from "next/image";
export default function Profile() {
  return (
    <CoachLayout>
      <div className="flex items-center flex-col">
        <h1 className="text-4xl m-4 font-thin font-lato">Profile</h1>
        <Image
          src="/lunges.png"
          alt="empty-state"
          width={"300"}
          height={"300"}
          className={"opacity-50 p-4"}
        />
        <p className={"opacity-50 text-4xl"}>No data to display</p>
      </div>
    </CoachLayout>
  );
}
