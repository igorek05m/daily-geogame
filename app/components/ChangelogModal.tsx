import React from 'react';
import { Modal } from './Modal';
import { FileText, GitCommit } from "lucide-react";
import { changelogData } from '@/app/lib/changelog';
import { ChangelogModalProps } from "@/app/types";

const colorMap: Record<string, string> = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  gray: "bg-gray-600",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  purple: "bg-purple-600"
};

export const ChangelogModal = ({ isOpen, onClose }: ChangelogModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Changelog">
      <div className="space-y-6 text-gray-300">
        
        <div className="relative border-l border-gray-700 ml-3 pl-6 pb-2 space-y-6">
            {changelogData.map((entry, index) => (
                <div key={index} className="relative">
                <span className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full ${colorMap[entry.color] || "bg-gray-500"} ring-4 ring-[#1e1e1e]`}></span>
                <h3 className="flex items-center text-lg font-bold text-white mb-1">
                    {entry.version} 
                    {entry.status && (
                        <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                        {entry.status}
                        </span>
                    )}
                </h3>
                {entry.date && <p className="text-xs text-gray-500 mb-2 font-mono">{entry.date}</p>}
                <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-400 marker:text-gray-600">
                    {entry.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                    ))}
                </ul>
                </div>
            ))}
        </div>

        <div className="pt-4 border-t border-[#333] flex justify-center">
            <a href="https://github.com/igorek05m/daily-geogame" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
                <GitCommit size={14} /> View full commit history
            </a>
        </div>

      </div>
    </Modal>
  );
};
