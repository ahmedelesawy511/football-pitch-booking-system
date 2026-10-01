import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";

export default function Home() {
  return (
    <>
      <div>
        <div className="flex flex-row gap-8 m-10 mt-12">
          <div className="flex-[1_1_0] py-12">
            <h1 className="text-5xl mb-4 font-extrabold leading-[1.125]">
              Book a Service in seconds.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              No accounts. No password. Just drop in your details and we'll
              handle the rest.
            </p>
          </div>
          <Card className="flex-[1_1_0] p-5">
            <form className="flex flex-col gap-5">
              <Field>
                <FieldLabel>Full name</FieldLabel>
                <Input placeholder="John Doe" type={"text"} />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input placeholder="john@example.com" type={"email"} />
              </Field>
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input placeholder="0123 456 7890" type={"tel"} />
              </Field>
              <Field>
                <FieldLabel>Message</FieldLabel>
                <Textarea placeholder="Briefly describe what you need done..."></Textarea>
              </Field>
              <Button
                type="submit"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Book Serivce
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
