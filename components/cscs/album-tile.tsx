"use client";

import { DirectionAwareHover } from "@/components/aceternity/direction-aware-hover";
import { FollowerPointerCard } from "@/components/aceternity/following-pointer";
import { Lens } from "@/components/aceternity/lens";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "@/components/aceternity/animated-modal";

/** Album cover: caption slides in from the cursor side; click opens a lightbox with a zoom lens. */
export function AlbumTile({ title, src }: { title: string; src: string }) {
  return (
    <Modal>
      <FollowerPointerCard title="View photo" className="rounded-2xl">
        <ModalTrigger className="block w-full p-0">
          <DirectionAwareHover imageUrl={src} className="h-72 w-full rounded-2xl md:h-80" imageClassName="object-cover">
            <p className="font-display text-xl font-bold uppercase">{title}</p>
          </DirectionAwareHover>
        </ModalTrigger>
      </FollowerPointerCard>
      <ModalBody className="border-neutral-200 shadow-2xl md:max-w-4xl">
        <ModalContent>
          <p className="eyebrow">Gallery</p>
          <h3 className="mt-1 text-3xl uppercase">{title}</h3>
          <div className="mt-5">
            <Lens zoomFactor={2} lensSize={180}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={title} className="max-h-[65vh] w-full rounded-lg object-contain" />
            </Lens>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Hover the photo to zoom in.</p>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
