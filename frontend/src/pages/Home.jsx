import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, Timer } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";

export default function Home() {
  const [date, setDate] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [startOption, setStartOption] = useState(null);
  const [endOption, setEndOption] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);

  function formatDate(date, isIso = false) {
    if (!(date instanceof Date)) return "";

    if (isIso) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } else {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      return `${dayName}, ${monthName} ${day}, ${year}`;
    }
  }

  const OPEN = 10;
  const LAST = 15;
  const MAX_DURATION = 6;

  function offsetToPeriod(offset) {
    if (offset === null) return null;

    const hour = (OPEN + offset) % 24;

    return `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`;
  }

  function periodToOffset(period) {
    const REGEX = /(\d+)\s*(am|pm)/i;

    const number = period.match(REGEX)[1];
    const isAm = period.match(REGEX)[2].toUpperCase() === "AM";

    const hour = (Number(number) % 12) + (isAm ? 0 : 12);

    return (hour - OPEN + 24) % 24;
  }

  function mapOptions(arr) {
    let array = arr.map((offset) => {
      return {
        offset: offset,
        label: offsetToPeriod(offset),
      };
    });

    return array;
  }

  let startOptions = mapOptions(Array.from({ length: LAST }, (_, i) => i));
  let endOptions = mapOptions(Array.from({ length: LAST }, (_, i) => i + 1));

  const duration =
    startOption !== null && endOption !== null ? endOption - startOption : null;

  function areValidOptions(start, end, maxDuration) {
    if (start === null || end === null) return true;

    return end > start && end <= start + maxDuration;
  }

  function handleStartOptionChange(s) {
    const offset = periodToOffset(s);

    setStartOption(offset);
    if (!areValidOptions(offset, endOption, MAX_DURATION)) setEndOption(null);
  }

  function handleEndOptionChange(e) {
    const offset = periodToOffset(e);

    setEndOption(offset);
    if (!areValidOptions(startOption, offset, MAX_DURATION))
      setStartOption(null);
  }

  function handleFormSubmission(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const nextFormErrors = {};

    const EMAILREGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONEREGEX = /^\+?[1-9]\d{6,14}$/;

    if (!formData.get("full_name").trim())
      nextFormErrors.fullName = "Full name is required";
    if (!formData.get("phone_number").trim())
      nextFormErrors.phoneNumber = "Phone number is required";
    if (
      !PHONEREGEX.test(
        formData.get("phone_number").replace(/[\s\-().]/g, ""),
      ) &&
      formData.get("phone_number").trim()
    )
      nextFormErrors.phoneNumber = "Invalid phone number";
    if (formData.get("email").trim()) {
      if (!EMAILREGEX.test(formData.get("email")))
        nextFormErrors.email = "Invalid Email";
    }

    if (!formData.get("pitch").trim())
      nextFormErrors.pitch = "Pitch is required";

    if (!formData.get("date").trim()) nextFormErrors.date = "Date is required";

    if (!formData.get("start_at").trim())
      nextFormErrors.startAt = "Starting time is required";

    if (!formData.get("end_at").trim())
      nextFormErrors.endAt = "Ending time is required";

    setFormErrors(nextFormErrors);

    const pitch = formData.get("pitch").match(/\d+/)?.[0];

    if (pitch) {
      formData.set("pitch", pitch);
    } else {
      formData.set("pitch", "");
    }

    formData.set(
      "start_at",
      formData.get("start_at").replace(/\s+/g, "").toLowerCase(),
    );

    formData.set(
      "end_at",
      formData.get("end_at").replace(/\s+/g, "").toLowerCase(),
    );

    if (Object.keys(nextFormErrors).length) return;

    const data = Object.fromEntries(formData);

    Object.keys(data).forEach((key) => {
      data[key] = data[key]?.trim();

      if (typeof data[key] === "string" && data[key].trim() === "") {
        data[key] = null;
      }
    });

    console.log(data);
  }

  return (
    <>
      <div>
        <div className="flex flex-col min-[60.5rem]:flex-row gap-3">
          {/* Information */}
          <div className="min-[60.5rem]:flex-[1_1_0] py-12">
            <h1 className="text-4xl sm:text-[2.5rem]  md:text-5xl mb-4 font-extrabold leading-[1.30]">
              Book a pitch in seconds.
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-10">
              No accounts. No password. Just drop in your details and we'll
              handle the rest.
            </p>
            <div className="flex flex-col gap-7">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-lg">
                  <CalendarIcon size={24} />
                </div>
                <div className="flex flex-col gap-2.25">
                  <span className="leading-none">Flexible Window</span>
                  <span className="leading-none text-muted-foreground">
                    Up to 2 weeks ahead
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-lg">
                  <Clock size={24} />
                </div>
                <div className="flex flex-col gap-2.25">
                  <span className="leading-none">Opening Hours</span>
                  <span className="leading-none text-muted-foreground">
                    10:00 AM - 1:00 AM
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-lg">
                  <Timer size={24} />
                </div>
                <div className="flex flex-col gap-2.25">
                  <span className="leading-none">Session Length</span>
                  <span className="leading-none text-muted-foreground">
                    1 to 6 hours per booking
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <Card className="min-[60.5rem]:flex-[1_1_0] p-4 md:p-5">
            <form
              onSubmit={handleFormSubmission}
              className="@container flex flex-col gap-5"
              noValidate
            >
              <Field>
                <FieldLabel>
                  Full name<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  required
                  placeholder="Enter your full name"
                  type={"text"}
                  name="full_name"
                />
                {formErrors.fullName && (
                  <FieldError>{formErrors.fullName}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Phone Number<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  required
                  placeholder="Enter your phone number"
                  type={"tel"}
                  name="phone_number"
                />
                {formErrors.phoneNumber && (
                  <FieldError>{formErrors.phoneNumber}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Email (optional)</FieldLabel>
                <Input
                  placeholder="Enter your email"
                  type={"email"}
                  name="email"
                />
                {formErrors.email && (
                  <FieldError>{formErrors.email}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Pitch<span className="text-destructive">*</span>
                </FieldLabel>
                <Select required name="pitch">
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a pitch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Pitches</SelectLabel>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Pitch 1">Pitch 1</SelectItem>
                      <SelectItem value="Pitch 2">Pitch 2</SelectItem>
                      <SelectItem value="Pitch 3">Pitch 3</SelectItem>
                      <SelectItem value="Pitch 4">Pitch 4</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formErrors.pitch && (
                  <FieldError>{formErrors.pitch}</FieldError>
                )}
              </Field>

              <FieldSet>
                <FieldLegend className={"text-sm!"}>
                  Schedule <span className="text-destructive">*</span>
                </FieldLegend>

                <Field>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full data-[empty=true]:text-muted-foreground data-[empty=true]:hover:text-muted-foreground",
                      )}
                      data-empty={!date}
                      render={
                        <Button>
                          <span className={"mr-auto"}>
                            {formatDate(date) || "Pick a date"}
                          </span>
                          <CalendarIcon />
                        </Button>
                      }
                    />
                    <PopoverContent>
                      <Calendar
                        selected={date}
                        onSelect={setDate}
                        disabled={{ before: today, after: maxDate }}
                        mode="single"
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    required
                    type="date"
                    name="date"
                    value={date ? date.toISOString().slice(0, 10) : ""}
                    className={"sr-only"}
                  />
                  {formErrors.date && (
                    <FieldError>{formErrors.date}</FieldError>
                  )}
                </Field>

                <div className="flex flex-col @md:flex-row gap-3 items-center">
                  <Field>
                    <Select
                      name="start_at"
                      required
                      value={offsetToPeriod(startOption)}
                      onValueChange={handleStartOptionChange}
                    >
                      <SelectTrigger className="[&>svg]:hidden">
                        <div className="w-full flex justify-between items-center">
                          <SelectValue placeholder="Pick a starting time" />
                          <Clock />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Start At</SelectLabel>
                          {startOptions.map((option) => (
                            <SelectItem
                              key={option.offset}
                              value={option.label}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <span className="hidden @md:inline text-md">:</span>
                  <Field>
                    <Select
                      name="end_at"
                      required
                      value={offsetToPeriod(endOption)}
                      onValueChange={handleEndOptionChange}
                    >
                      <SelectTrigger className="[&>svg]:hidden">
                        <div className="w-full flex justify-between items-center">
                          <SelectValue placeholder="Pick an ending time" />
                          <Clock />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>End At</SelectLabel>
                          {endOptions.map((option) => (
                            <SelectItem
                              key={option.offset}
                              value={option.label}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {formErrors.startAt && (
                  <FieldError>{formErrors.startAt}</FieldError>
                )}

                {formErrors.endAt && (
                  <FieldError>{formErrors.endAt}</FieldError>
                )}

                {duration && (
                  <div className="w-full flex justify-between text-muted-foreground">
                    <span>Duration</span>
                    <span>
                      {duration} {duration === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                )}
              </FieldSet>

              <Field>
                <FieldLabel>Message (optional)</FieldLabel>
                <Textarea
                  name="message"
                  placeholder="Briefly describe what you need done"
                ></Textarea>
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
