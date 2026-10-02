import type { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { PageHeader, Section } from "@/components/cscs/section";
import { TrialForm } from "@/components/cscs/trial-form";

export const metadata: Metadata = { title: "Trials registration", description: "Register interest in CSCS district and zone trials." };

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Trials registration" }]}
        eyebrow="Academy & trials"
        title="Register for trials"
        blurb="Tell the Sangh about the player. You will be contacted when trials for the matching age group and zone open."
      />
      <Section bordered={false} className="pt-0 sm:pt-0">
        <div className="mx-auto max-w-4xl">
          <Alert className="mb-6">
            <Info />
            <AlertTitle>Preview form</AlertTitle>
            <AlertDescription>
              This form isn&apos;t connected to the Sangh&apos;s systems yet, so nothing you enter is sent or stored.
            </AlertDescription>
          </Alert>
          <TrialForm />
        </div>
      </Section>
    </>
  );
}
