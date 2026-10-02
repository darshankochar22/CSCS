"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/aceternity/file-upload";
import { MultiStepLoader } from "@/components/aceternity/multi-step-loader";
import { Button as StatefulButton } from "@/components/aceternity/stateful-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ZONES, type ZoneKey } from "@/lib/data";

const AGE_GROUPS = ["Under-15", "Under-16", "Under-19", "Under-23", "Senior"];
const ROLES = ["Batter", "Bowler", "All-rounder", "Wicket-keeper"];

const STEPS = [
  { text: "Checking your details" },
  { text: "Attaching documents" },
  { text: "Matching you to a zone trial" },
  { text: "Preparing your confirmation" },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Trials registration form. Front end only: nothing is sent anywhere until a
 * backend is connected.
 */
export function TrialForm() {
  const [dob, setDob] = useState<Date | undefined>();
  const [otp, setOtp] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await wait(STEPS.length * 900);
    setLoading(false);
    toast("Registration not sent", {
      description: "This form is a preview and is not connected yet. Nothing was submitted.",
    });
  };

  return (
    <>
      <MultiStepLoader loadingStates={STEPS} loading={loading} duration={900} loop={false} />
      <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl border p-6 sm:p-10">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Player details</FieldLegend>
            <FieldDescription>As they appear on the player&apos;s age-proof document.</FieldDescription>
            <FieldGroup className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="first">First name</FieldLabel>
                <Input id="first" autoComplete="given-name" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="last">Last name</FieldLabel>
                <Input id="last" autoComplete="family-name" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="dob" variant="outline" className="justify-start font-normal">
                      <CalendarIcon /> {dob ? format(dob, "d MMMM yyyy") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={setDob}
                      captionLayout="dropdown"
                      startMonth={new Date(1985, 0)}
                      endMonth={new Date(2016, 11)}
                      defaultMonth={new Date(2010, 0)}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field>
                <FieldLabel htmlFor="age">Age group</FieldLabel>
                <Select>
                  <SelectTrigger id="age" className="w-full"><SelectValue placeholder="Choose an age group" /></SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="zone">Zone</FieldLabel>
                <Select>
                  <SelectTrigger id="zone" className="w-full"><SelectValue placeholder="Choose your zone" /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ZONES) as ZoneKey[]).map((z) => <SelectItem key={z} value={z}>{ZONES[z].name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="district">District association</FieldLabel>
                <Input id="district" placeholder="e.g. Raipur" />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend variant="label">Playing role</FieldLegend>
            <RadioGroup defaultValue="Batter" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ROLES.map((r) => (
                <FieldLabel key={r} htmlFor={`role-${r}`} className="rounded-xl border">
                  <Field orientation="horizontal">
                    <RadioGroupItem value={r} id={`role-${r}`} />
                    <span className="text-sm font-medium">{r}</span>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Contact</FieldLegend>
            <FieldGroup className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="phone">Mobile number</FieldLabel>
                <div className="flex">
                  <span className="grid place-items-center rounded-l-md border border-r-0 px-3 text-sm text-muted-foreground">+91</span>
                  <Input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" className="rounded-l-none" />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                <InputOTP id="otp" maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }, (_, i) => <InputOTPSlot key={i} index={i} />)}
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription>The six-digit code sent to the mobile number.</FieldDescription>
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="notes">Playing history</FieldLabel>
                <Textarea id="notes" rows={4} placeholder="Clubs, schools and tournaments played, with years." />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Documents</FieldLegend>
            <FieldDescription>Age proof, a recent photo and, if you have one, a medical certificate.</FieldDescription>
            <div className="rounded-2xl border border-dashed">
              <FileUpload onChange={setFiles} />
            </div>
            {files.length ? <p className="text-sm text-muted-foreground">{files.length} file(s) attached.</p> : null}
          </FieldSet>

          <Field orientation="horizontal">
            <Checkbox id="consent" />
            <FieldLabel htmlFor="consent" className="font-normal">
              I confirm these details are correct and that a parent or guardian has consented for players under 18.
            </FieldLabel>
          </Field>

          <div className="flex flex-wrap items-center gap-4">
            <StatefulButton type="button" onClick={submit} className="h-11 px-6">
              Submit registration
            </StatefulButton>
            <p className="text-xs text-muted-foreground">Preview only: this form is not connected yet.</p>
          </div>
        </FieldGroup>
      </form>
    </>
  );
}
