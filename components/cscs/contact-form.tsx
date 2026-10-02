"use client";

import { toast } from "sonner";
import { Button as StatefulButton } from "@/components/aceternity/stateful-button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const TOPICS = ["Tournaments & fixtures", "Registration & trials", "Tenders & RFP", "Media", "Something else"];

/** Contact form. Front end only until a backend is connected. */
export function ContactForm() {
  const send = async () => {
    await new Promise((r) => setTimeout(r, 1200));
    toast("Message not sent", { description: "This form is a preview and is not connected yet." });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl border bg-white p-6 sm:p-8">
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="c-name">Name</FieldLabel>
            <Input id="c-name" autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="c-email">Email</FieldLabel>
            <Input id="c-email" type="email" autoComplete="email" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="c-topic">Topic</FieldLabel>
          <Select>
            <SelectTrigger id="c-topic" className="w-full"><SelectValue placeholder="What is it about?" /></SelectTrigger>
            <SelectContent>{TOPICS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="c-msg">Message</FieldLabel>
          <Textarea id="c-msg" rows={6} />
        </Field>
        <div className="flex flex-wrap items-center gap-4">
          <StatefulButton type="button" onClick={send} className="h-11 px-6">Send message</StatefulButton>
          <p className="text-xs text-muted-foreground">Preview only: not connected yet.</p>
        </div>
      </FieldGroup>
    </form>
  );
}
